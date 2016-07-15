require('./styles/styles.less');

var Position = require('../../models/Position');

var buttonPlacements = [
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left'
];

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
    var position = component.position;
    document.addEventListener('mousemove', component.onMouseDrag);
    document.addEventListener('mouseup', component.onMouseDragEnd);
    component.setState('mouseDownTime', new Date().getTime());
    // component.setState('offsetY', element.offsetTop - domEvent.clientY);
    // component.setState('offsetX', element.offsetLeft - domEvent.clientX);
    // component.setState('x', domEvent.clientX);
    // component.setState('y', domEvent.clientY);
    component.setState('dragged', true);
    component.setState('dragging', true);

    position.setY(domEvent.clientY);
    position.setX(domEvent.clientX);
    position.setOffsetY(element.offsetTop - domEvent.clientY);
    position.setOffsetX(element.offsetLeft - domEvent.clientX);
}
function _onDragEnd(component) {
    return function (e) {
        var time = new Date().getTime();
        if(time - component.state.mouseDownTime > 250) {
            setTimeout(function () {
                component.setState('dragging', false);
            }, 200);
        } else {
            component.setState('dragging', false);
        }
        document.removeEventListener('mousemove', component.onMouseDrag);
        document.removeEventListener('mouseup', component.onMouseDragEnd);
        setTimeout(function() {
            component.setStateDirty('dragging', false);
        }, 10);
    };
}
function _onDrag(component) {
    return function (e) {
        var x = e.clientX, y = e.clientY;
        var cssPosition = component.state.position;
        var position = component.position;
        if (!cssPosition || cssPosition.trim().toLowerCase() === 'absolute') {
            var el = component.getEl();
            var bounds = el.parentNode.getBoundingClientRect();
            if (y < bounds.bottom && y > bounds.top) {
                position.setY(y);
            }
            if (x < bounds.right && x > bounds.left){
                position.setX(x)
            }
        } else {
            if (y < _getDocumentHeight() && y > 0) {
                position.setY(y);
            }
            if (x < _getDocumentWidth() && x > 0){
                position.setX(x);
            }
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
        var position = self.position = new Position();
        position.on('change:x', function(event) {
                self.setState('x', event.newValue);
            })
            .on('change:y', function(event) {
                self.setState('y', event.newValue);
            })
            .on('change:offsetX', function(event) {
                self.setState('offsetX', event.newValue);
            })
            .on('change:offsetY', function(event) {
                self.setState('offsetY', event.newValue);
            });
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
        var center;
        switch(input.direction) {
            case 'left':
                direction = 'marko-fa-row-reverse'
                center = 'marko-fa-vertical-center';
                break;
            case 'right':
                direction = 'marko-fa-row';
                center = 'marko-fa-vertical-center';
                break;
            case 'down':
                direction = 'marko-fa-column';
                center = 'marko-fa-horizontal-center';
                break;
            case 'up':
            default:
                direction = 'marko-fa-column-reverse';
                center = 'marko-fa-horizontal-center';
        }
        var placement = input.placement;
        if (placement === undefined) {
            placement = 'bottom-right';
        } else if(buttonPlacements.indexOf(placement) === -1) {
            throw new Error('Invalid button placement');
        }
        return {
            mainButton: mainButton,
            menuItems: menuItems,
            revealOnHover: input.revealOnHover,
            direction: direction,
            style: input.style,
            draggable: input.draggable,
            placement: placement,
            position: input.position,
            center: center
        };
    },

    getInitialState: function(input) {
        input.showContent = false;
        input.reveal = false;
        return input;
    }
});
