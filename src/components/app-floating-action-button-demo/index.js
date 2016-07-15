module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),

    handleClick: function() {
        this.private = !this.private;
        this.setProps('state', !this.state.state);

    },
    init: function() {
    },
    getInitialState(input) {
        return {
            state: false
        };
    }
});
