u.require('effects');

(function () {

var LC = {
	MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] }

new u.Module("calendar", { version: .1, hasCSS: !0 },
// core
{ Calendar: u.Class({
	current: {
		year: new Date().getFullYear(),
		month: new Date().getMonth(),
		day: new Date().getDate(),
		date: new Date },

	__init__: function (field) {
		(this.element = field).calendar = this;
		this.DOM = { main: u.DOM.create("div.u-calendar").hide() };
		this.DOM.switcher = this.DOM.main.append("div.u-calendar-switcher");
		this.DOM.decade = this.DOM.main.append("table.u-calendar-decade");
		this.DOM.year = this.DOM.main.append("table.u-calendar-year");
		this.DOM.month = this.DOM.main.append("table.u-calendar-month");
		this.DOM.buttons = this.DOM.main.append("div.u-calendar-buttons");
		this.DOM.buttons.prev = this.DOM.buttons.append("button.u-calendar-buttons-prev", "«");
		this.DOM.buttons.next = this.DOM.buttons.append("button.u-calendar-buttons-next", "»");

		for (var w = -1, weeks = this.DOM.month.append("tr"); LC.DAYS[++w];)
			weeks.append("th", LC.DAYS[w].slice(0, 2));

		var this_ = this;
		u(field).on('focus', u.Calendar.open);
		this.DOM.buttons.prev.on('click', function () { this_.prevMonth(); });
		this.DOM.buttons.next.on('click', function () { this_.nextMonth(); });
	},

	$open: function () {
		var c = this.calendar;
		u("body").append(c.DOM.main).pos(['left', 'bottom+height'], this).show();
		!c.DOM.switcher.text() && c.goTo(c.current.date); },

	goTo: function (date) {
		this.month(date.getFullYear(), date.getMonth()); },

	month: function (year, month) {
		var date = new Date(year, month, 1);
		this.current.year = date.getFullYear();
		this.current.month = date.getMonth();
		this.DOM.switcher.text(LC.MONTHS[this.current.month] + " " + this.current.year);
		this.DOM.month.children().exclude(":first").remove();
		for (var day = 1, i = 0, w, d,
		firstWeekDay = date.getDay(),
		last = new Date(new Date(year, month + 1, 1) - 86400000).getDate(); day <= last; i++) {
			w = i % 7 ? w : this.DOM.month.append("tr");
			d = w.append("td");
			if (i >= firstWeekDay)
				(function (d, day) { setTimeout(function () {
					d.append("button", day).up().hide().fadeIn({ duration: 300 }); }, day * 15); })(d, day++); }
		this.DOM.main.anim({ height: this.DOM.switcher.size().height + this.DOM.month.size().height });
	},

	prevMonth: function () {
		this.month(this.current.year, this.current.month - 1); },

	nextMonth: function () {
		this.month(this.current.year, this.current.month + 1); }
})},

// methods for elements
{},

// initializer
function () {
	for (var i = -1, els = u(".calendar"); els[++i];)
		new u.Calendar(els[i]);
});

})()