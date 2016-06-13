module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    handleClick: function() {
        console.log('clicked the button');
    }
});
