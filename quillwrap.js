/**
 * Little helper for converting textareas into Quill-powered editors. Use the
 * autoinit() method to automatically convert textareas with class "rte" into
 * quill editors.
 *
 * Notes. The original textarea is hidden, but updated. So you should be able to
 * submit the form without having to perform any extra steps
 *
 * by Luke (medialight.com.au)
 *
 * @version 2;
 */
/*global define module  */
/*global require:false */
(function (root, factory) {
    "use strict";
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS module is defined  (needs testing! )
        module.exports = factory(require("jquery"), require("quill"));
    } else if (typeof define === "function" && define.amd) {
        // AMD module is defined... Register as an anonymous AMD module:
        define(["jquery", "quill"], factory);
    } else {
        //
        root.quillwrap = factory(root.jQuery, root.Quill);
    }

}(this, function ($, Quill) {
    return {
        defaultConfig: {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    ['link', 'blockquote', 'code-block'],
                    [{list: 'ordered'}, {list: 'bullet'}]
                ]
            },
            theme: 'snow'  
        },
        /**
         * Use the autoInit function to automatically convert textareas with
         * class "rte" into quill editors.  This basically looks for all the
         * textareas with class "rte" and hides them, adding a special div for
         * the Quill Editor
         *
         * @param {object} defaultConfig optional
         * @returns {undefined}
         */
        autoinit: function (defaultConfig) {

            var me = this;
            if (defaultConfig) {
                $.extend(this.defaultConfig, defaultConfig);
            }

            $('textarea.rte').each(function (idx) {
                var $inpt, id;
                $inpt = $(this);
                id = $inpt.attr('id');
                if (!id) {
                    console.warn('Cannot autoinit Quill editor for textarea - the textarea needs an id');
                    id = $inpt.attr('name') + '_rte_' + idx;
                    $inpt.attr('id', id);
                }
                me.init($inpt);
                //toggle classes to indicated this textarea is 'active'
                $inpt.toggleClass('rte rte-active');

            });

        },
        /**
         * Initialise a specific input
         * @param {type} $inpt
         * @returns {undefined}
         */
        init: function ($inpt, configOver) {
            var conf = this._setupInput($inpt, configOver);
            // instantiate Quill
            var quillInstance = new Quill('#' + conf.id, conf.quillConfig);
            quillInstance.on('selection-change', function (range, oldRange, source) {
                if (range === null && oldRange !== null) {
                    conf.container.removeClass('focussed');
                } else if (range !== null && oldRange === null) {
                    conf.container.addClass('focussed');
                }
                $inpt.val(quillInstance.root.innerHTML).trigger('change');
            });
            quillInstance.on('text-change', function () {
                $inpt.val(quillInstance.root.innerHTML).trigger("change"); // .trigger('change input');   // ths no work :(
            });
            $inpt.data('editor', {
                instance: quillInstance,
                flush: function () {
                    var updatedContent = this.instance.root.innerHTML;
                    $inpt.val(updatedContent).trigger('change');
                },
                destroy: function () {
                    conf.container.remove();
                    $inpt.show();
                }
            });
        },
        /**
         * Create a container for Quill, returning a config object
         *
         * @param {type} $inpt
         * @returns {quillwrapL#15.quillwrap.setupInput.quillwrapAnonym$10}
         */
        _setupInput: function ($inpt, conf) {
            var h = $inpt.height(),
                id = $inpt.attr('id') + '_rte',
                ph = $inpt.attr('placeholder'),
                c = $inpt.val(),
                $i = $('<div />').attr({
                    class: 'rte-inner form-control', id: id
                }).html(c).css('min-height', h),
                $container = $('<div />')
                    .attr({
                        class: 'rte-container '
                    });
            $i.appendTo($container.insertAfter($inpt.hide()));

            // create config for the editor
            var newConig = {}, 
                quillConfig = $.extend(newConig, this.defaultConfig, conf);
            if (ph) { // copy the placeholder over
                quillConfig.placeholder = ph;
            }
            if ($inpt.data('scroll')) {
                quillConfig.scrollingContainer = $inpt.data('scroll');
            }
            if ($inpt.data('theme')) {
                quillConfig.theme = $inpt.data('theme');
            }

            return {
                id: id,
                container: $container,
                quillConfig: quillConfig
            };
        },
        /**
         * Shouldnt really need this, but hey...
         * @returns {undefined}
         */
        flushAll: function () {
            var quill;
            $('textarea.rte-active').each(function (idx) {
                quill = $(this).data('editor');
                if (quill) {
                    quill.flush();
                }
            });
        }


    };
}));