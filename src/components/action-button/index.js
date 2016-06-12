require('./styles/styles.less');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    init: function() {
        var self = this;
        var el = self.getEl();
        el.addEventListener('mouseenter', function() {
            self.setState('showLabel', true);
        });
        el.addEventListener('mouseleave', function() {
            self.setState('showLabel', false);
        });
    },


    getInitialState: function(input) {
        return {
            main : input.main,
            index : input.index,
            animationDelay : input.index / 30,
            icon: input.icon,
            label: input.label,
            reveal: input.reveal,
            showLabel : input.showLabel
        };
    }
});
