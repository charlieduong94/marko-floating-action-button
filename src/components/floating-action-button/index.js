require('./styles/styles.less');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    init: function() {
        var self = this;
        var el = self.getEl();
        console.log(self);
        el.addEventListener('mouseenter', function(e) {
            e.preventDefault();
            self.setState('showContent', true);
        });

        el.addEventListener('mouseleave', function(e) {
            e.preventDefault();
            self.setState('showContent', false);
        });
    },

    getInitialProps: function(input, out) {
        var buttons = input.button;
        var mainButton = input['main-button'] || [];
        var menuItems = input['menu-item'] || [];
        return {
            mainButton : mainButton,
            menuItems : menuItems.map(function (item) {
                return item;
            })
        };
    },

    getInitialState: function(input) {
        console.log(input);
        return {
            mainButton: input.mainButton,
            menuItems: input.menuItems,
            showContent : false,
            popIn : false,
        };
    }
});
