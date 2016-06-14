require('./styles/styles.less');

function _toggleIcon(component){
    var icons = component.getEl().childNodes[0].childNodes;
    console.log(component.state);
    if (!component.state.transformIcon || icons.length <= 1) {
        return;
    }
    var firstIcon = icons[0];
    var secondIcon = icons[1];
        console.log('toggling');
    if(firstIcon.style.display === 'none') {
        firstIcon.style.display = '';
        secondIcon.style.display = 'none';
    } else {
        firstIcon.style.display = 'none';
        secondIcon.style.display = '';
    }
}

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    init: function() {
        var self = this;
        var el = self.getEl();
        el.addEventListener('mouseenter', function(event) {
            self.setState('showLabel', true);
            _toggleIcon(self);
        });
        el.addEventListener('mouseleave', function() {
            self.setState('showLabel', false);
            _toggleIcon(self);
        });
        var icons = el.childNodes[0].childNodes;
        if(icons.length > 1) {
            for (var i = 1; i < icons.length; i++) {
                icons[i].style.display = 'none';
            }
        }
    },

    handleClick: function(event) {
        _toggleIcon(this);
        this.emit('click', event);
    },

    getInitialState: function(input) {
        console.log(input);
        var iconColor = input.iconColor || 'white';
        var backgroundColor = input.bgColor || '#333333';
        return {
            backgroundColor: backgroundColor,
            iconColor: iconColor,
            icon: input.renderBody,
            main : input.main,
            label: input.label,
            showLabel : input.showLabel,
            transformOnClick : input.transformOnClick
        };
    }
});
