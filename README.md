# quillwrap
A simple module for for converting textareas into Quill-powered editors. 

Example use

```javascript
var quillWrap = require('quillwrap');
quillWrap.autoinit();
```

The autoinit() method automatically converts textareas with class "rte" into Quill editors. The original textareas are hidden, but their values will update automatically (so you should be able to submit the form without having to perform any extra steps)
