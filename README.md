# quillwrap
A simple module for for converting textareas into Quill-powered editors. 

Example use

```html
<script src="jquery.js"></script>
<script src="quill.js"></script>
<script src="quillwrap.js"></script>
<script>
$(document).ready(function () {
    quillwrap.autoinit();
});
</script>
```

Or if you are using AMD modules...

```javascript
var quillWrap = require('quillwrap');
quillWrap.autoinit();
```

The autoinit() method automatically converts textareas with class "rte" into Quill editors. The original textareas are hidden, but their values will update automatically (so you should be able to submit the form without having to perform any extra steps).

Additional demo is here: https://github.com/luke-mml/quillwrap-demo
