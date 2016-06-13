require('./styles/styles.less');

function _showMenu(component) {
    clearInterval(component.revealTimeout);
    clearInterval(component.hideTimeout);
    component.setState('reveal', true);
    component.revealTimeout = setTimeout(function() {
        component.setState('showContent', true);
    }, 200);
}

function _hideMenu(component) {
    clearInterval(component.revealTimeout);
    clearInterval(component.hideTimeout);
    component.setState('showContent', false);
    component.hideTimeout = setTimeout(function() {
        component.setState('reveal', false);
    }, component.state.menuItems.length * 100);
}

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    handleMouseEnter: function() {
        _showMenu(this);
    },

    handleMouseLeave: function() {
        _hideMenu(this);
    },

    handleToggleReveal: function() {
        if (this.state.reveal) {
            _hideMenu(this);
        } else {
            _showMenu(this);
        }
    },

    noOp: function () {},

    getInitialProps: function(input, out) {
        var mainButton = input['main-button'] || [];
        var menuItems = input['menu-item'] || [];
        var direction;
        switch(input.direction) {
            case 'left':
                direction = 'marko-fa-row-reverse'
                break;
            case 'right':
                direction = 'marko-fa-row';
                break;
            case 'down':
                direction = 'marko-fa-column';
                break;
            case 'up':
            default:
                direction = 'marko-fa-column-reverse';
         }
        return {
            mainButton: mainButton,
            menuItems: menuItems,
            revealOnHover: input.revealOnHover,
            direction: direction,
            style: input.style
        };
    },

    getInitialState: function(input) {
        console.log(input);
        return {
            mainButton: input.mainButton,
            menuItems: input.menuItems,
            showContent: false,
            revealOnHover: input.revealOnHover,
            direction: input.direction,
            reveal: false,
            style: input.style
        };
    },

});
