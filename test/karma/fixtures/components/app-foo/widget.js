var expect = require('chai').expect;

function Widget(config) {
    this.name = 'app-foo';
    window.testData.addWidget('app-foo', this);
    this.config = config;
    this.widgets.bar.appendHtml('FOO');
}

Widget.prototype = {
    testDestroy: function() {
        var appBarWidget = this.widgets.bar;

        var eventsFired = {};

        appBarWidget
            .on('destroy', function() {
                eventsFired.destroy = true;
            })
            .on('beforeDestroy', function() {
                eventsFired.beforeDestroy = true;
            });

        expect(this.isDestroyed()).to.equal(false);
        expect(appBarWidget.isDestroyed()).to.equal(false);

        this.destroy();

        expect(this.isDestroyed()).to.equal(true);
        expect(appBarWidget.isDestroyed()).to.equal(true);
        expect(eventsFired.destroy).to.equal(true);
        expect(eventsFired.beforeDestroy).to.equal(true);
    },

    testCustomEvents: function() {
        var testEventFired = false;

        this.widgets.bar.on('testEvent', function(a, b) {
            expect(a).to.equal('a');
            expect(b).to.equal('b');
            testEventFired = true;
        });

        this.widgets.bar.emitTestEvent();

        expect(testEventFired).to.equal(true);
    },

    testDOMLookup: function() {
        expect(this.el).to.equal(this.getEl());
        expect(this.getEl('config').className).to.equal('config');
        // Make sure the generated element ID starts with the widget ID
        expect(this.getEl('config').id.substring(0, this.el.id.length)).to.equal(this.el.id);
    }
};

module.exports = Widget;