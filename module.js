u.require('effects');

(function () {

var LC = {
	MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	formatDate: function (date) {
		return date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate(); }}

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
		u(field).on('focus', function () { this_.open(); });
		this.DOM.buttons.prev.on('click', function () { this_.prevPage(); });
		this.DOM.buttons.next.on('click', function () { this_.nextPage(); });
		this.DOM.main.on('click', function (e) { this_.select(e); });
		this.DOM.switcher.on('click', function () {
			if (this_.current.month != undefined)
				this_.DOM.month.suck({ duration: 300 }, function () {
					this_.DOM.year.show();
					this_.year(this_.current.year); });
		});
	},

	open: function () {
		u("body").append(this.DOM.main).pos(['left', 'bottom+height'], this.element).show();
		!this.DOM.switcher.text() && this.goTo(this.current.date); },

	close: function () {
		this.DOM.main.fadeOut({ duration: 200, destroy: !0 }); },

	select: function (e) {
		var this_ = this;
		if (e.target.parentNode.nodeName == "TD")
			if (this.current.month != undefined) {
				this.current.day = +u(e.target).text();
				this.element.value = LC.formatDate(new Date(this.current.year, this.current.month, this.current.day));
				this.close(); }
			else
			if (this.current.year != undefined)
				this.DOM.year.puff({ duration: 300 }, function () {
					this_.DOM.month.show();
					this_.month(this_.current.year, u("button", this_.DOM.year).indexOf(e.target))
				})
	},

	goTo: function (date) {
		this.month(date.getFullYear(), date.getMonth()); },

	year: function (year) {
		this.current.year = year;
		this.current.month = undefined;
		this.DOM.switcher.text(year);
		this.DOM.year.empty();
		for (var i = 0, r, m; i < 12; i++) {
			r = i % 3 ? r : this.DOM.year.append("tr");
			m = r.append("td");
			(function (m, i) { setTimeout(function () {
				m.add("button", LC.MONTHS[i].slice(0, 3) + " '" + (''+year).slice(-2)).hide().fadeIn({ duration: 300 });
			}, i * 15); })(m, i); }
		this.DOM.main.anim({ height: this.DOM.switcher.size().height + this.DOM.year.size().height });
	},

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
			i >= firstWeekDay && (function (d, day) { setTimeout(function () {
				d.add("button", day).hide().fadeIn({ duration: 300 }); }, day * 15); })(d, day++); }
		this.DOM.main.anim({ height: this.DOM.switcher.size().height + this.DOM.month.size().height });
	},

	prevPage: function () {
		this.DOM.month.size().height &&
			this.month(this.current.year, this.current.month - 1) ||
		this.DOM.year.size().height &&
			this.year(this.current.year - 1); },

	nextPage: function () {
		this.DOM.month.size().height &&
			this.month(this.current.year, this.current.month + 1) ||
		this.DOM.year.size().height &&
			this.year(this.current.year + 1);
	}
})},

// methods for elements
{},

// initializer
function () {
	for (var i = -1, els = u(".calendar"); els[++i];)
		new u.Calendar(els[i]);
});

})()