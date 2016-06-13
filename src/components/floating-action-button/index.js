require('./styles/styles.less');

function _getDocumentWidth() {
    var width = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    return width;
}

function _getDocumentHeight() {
    var height = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    return height;
}


function _startDrag(component, domEvent) {
    var element = component.getEl();

    document.addEventListener('mousemove', component.onMouseDrag);
    document.addEventListener('mouseup', component.onMouseDragEnd);
    component.setState('mouseDownTime', new Date().getTime());
    component.setState('offsetY', element.offsetTop - domEvent.clientY);
    component.setState('offsetX', element.offsetLeft - domEvent.clientX);
    component.setState('dragged', true);
    component.setState('dragging', true);
    component.setState('x', domEvent.clientX);
    component.setState('y', domEvent.clientY);
}
function _onDragEnd(component) {
    return function (e) {
        var time = new Date().getTime();
        if(time - component.state.mouseDownTime > 250) {
            console.log('mouse up');
            setTimeout(function () {
                component.setState('dragging', false);
            }, 200);
        } else {
            component.setState('dragging', false);
        }
        console.log(component.state.dragging);
        document.removeEventListener('mousemove', component.onMouseDrag);
        document.removeEventListener('mouseup', component.onMouseDragEnd);

    };
}
function _onDrag(component) {
    return function (e) {
        var x = e.clientX, y = e.clientY;
        if (y < _getDocumentHeight() && y > 0) {
            component.setState('y', e.clientY);
        }
        if (x < _getDocumentWidth() && x > 0){
            component.setState('x', e.clientX);
        }
    };
}

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

    init: function() {
        var self = this;
        var el = self.getEl();

        self.onMouseDrag = _onDrag(self);
        self.onMouseDragEnd = _onDragEnd(self);
        self.onStartDrag = function(e) {
            _startDrag(self, e);
        };

        el.addEventListener('mousedown', self.onStartDrag);
    },

    handleMouseEnter: function() {
        _showMenu(this);
    },

    handleMouseLeave: function() {
        _hideMenu(this);
    },

    handleToggleReveal: function() {
        console.log(this.state.dragging);
        if(!this.state.dragging) {
            if (this.state.reveal) {
                _hideMenu(this);
            } else {
                _showMenu(this);
            }
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
            style: input.style,
            draggable: input.draggable
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
            style: input.style,
            draggable : input.draggable
        };
    },

});
