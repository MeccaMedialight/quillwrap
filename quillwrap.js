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
 * @param {type} $
 * @param {type} Mustache
 * @returns {quillwrap}
 */
/*global define */
/*global require:false */

define(["jquery"], function ($) {

    var quillwrap = {
        /**
         * Use the autoInit function to automatically convert textareas with
         * class "rte" into quill editors.  This basically looks for all the
         * textareas with class "rte" and hides them, adding a special div for
         * the Quill Editor
         *
         * @returns {undefined}
         */
        autoinit: function () {
            var me = this;
            require(["quill"], function (Quill) {
                $('textarea.rte').each(function (idx) {
                    var $inpt, id, conf, quillInstance;
                    $inpt = $(this);
                    id = $inpt.attr('id');
                    if (!id) {
                        console.warn('Cannot autoinit Quill editor for textarea - the textarea needs an id');
                    } else {
                        conf = me.setupInput($inpt);
                        // instantiate Quill
                        quillInstance = new Quill('#' + conf.id, conf.quillConfig);
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
                        //toggle classes to indicated this textarea is 'active'
                        $inpt.toggleClass('rte rte-active');
                    }
                });
            });
        },
        /**
         * Create a container for Quill, returning a config object
         *
         * @param {type} $inpt
         * @returns {quillwrapL#15.quillwrap.setupInput.quillwrapAnonym$10}
         */
        setupInput: function ($inpt) {
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
            var quillConfig = {
                modules: {
                    toolbar: [
                        ['bold', 'italic'],
                        ['link', 'blockquote', 'code-block'],
                        [{list: 'ordered'}, {list: 'bullet'}]
                    ]
                },
                theme: 'snow' //scrollingContainer: id,
            };
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
    return quillwrap;
});
