u.require('effects');

(function () {

new u.Module("calendar", { version: .1, hasCSS: !0 },
// core
{
Date: {
	lastDayOf: function (year, month) {
		return new Date(new Date(yeah, month, 1) - 86400000).getDate(); }
},
Calendar: u.Class({
	__init__: function () {
		this.DOM = { main: u.DOM.create("div.u-calendar").hide() };
		this.DOM.switcher = this.DOM.main.append("div.u-calendar-switcher");
		this.DOM.decade = this.DOM.main.append("table.u-calendar-decade");
		this.DOM.year = this.DOM.main.append("table.u-calendar-year");
		this.DOM.month = this.DOM.main.append("table.u-calendar-month");

		for (var w = -1, weeks = this.DOM.month.append("tr"); LC.DAYS[++w];)
			weeks.append("th", LC.DAYS[w].slice(0, 3));

		var today = new Date();
		this.goTo(today);
	},

	goTo: function (date) {
		this.month(date.getFullYear(), date.getMonth());
	},

	month: function (year, month) {
		this.DOM.switcher.text(LC.MONTHS[month])
		this.DOM.month.children().exclude(":first").remove(!0);
		var
		firstWeekDay = new Date(year, month, 1).getDay(),
		l = new Date(new Date(year, month + 1, 1) - 86400000).getDate();
		for (var day = 1, i = 0, w, d; day <= l; i++) {
			w = i % 7 ? w : this.DOM.month.append("tr");
			d = w.append("td");
			i >= firstWeekDay && d.text(day++) }
	}
})},

// methods for elements
{
	calendar: function () {
		return u(this).on('focus,blur', toggleCalendar); }
},

// initializer
function () {
	u(".calendar").calendar();
});

function toggleCalendar(e) {
	var c = this.calendar = this.calendar || new u.Calendar().DOM.main;
	if (e.type == 'focus') {
		u("body").append(c).pos(['left', 'bottom+height'], this).fadeIn({ duration: 200 }); }
// 	else
// 		c.fadeOut({ duration: 300, destroy: !0 });
}

var LC = {
	MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}

})()