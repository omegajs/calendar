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
	current: {},

	__init__: function (field) {
		(this.element = field).calendar = this;
		this.DOM = { main: u.DOM.create("div.u-calendar").hide() };
		this.DOM.switcher = this.DOM.main.append("div.u-calendar-switcher").append("button");
		this.DOM.buttonPrev = this.DOM.main.append("button.u-calendar-button-prev", "«");
		this.DOM.decade = this.DOM.main.append("table.u-calendar-decade");
		this.DOM.year = this.DOM.main.append("table.u-calendar-year");
		this.DOM.month = this.DOM.main.append("table.u-calendar-month");
		this.DOM.buttonNext = this.DOM.main.append("button.u-calendar-button-next", "»");
		this.DOM.weekDays = this.DOM.month.append("tr.u-calendar-weekdays");

		for (var w = -1; LC.DAYS[++w];)
			this.DOM.weekDays.append("th", LC.DAYS[w].slice(0, 2));

		var this_ = this;
		u(field).on('focus,click', function () { this_.open() });
		this.DOM.buttonPrev.on('click', function () { this_.prevPage(); });
		this.DOM.buttonNext.on('click', function () { this_.nextPage(); });
		this.DOM.main.on('keydown', function (e) { this_.navigate(e); })
		this.DOM.main.on('click', function (e) { this_.select(e); });
	},

	open: function () {
		u("body").append(this.DOM.main).pos(['left', 'bottom+height+2'], this.element).show();
		!this.DOM.switcher.text() && this.goTo(new Date); },

	close: function () {
		this.DOM.main.fadeOut({ duration: 200, destroy: !0 }); },

	goTo: function (date) {
		this.month(date.getFullYear(), date.getMonth(), date.getDate()); },

	navigate: function (e) {
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			e.preventDefault();
			// TODO
		}
		else
		if (e.keyCode == 27)
			this.close();
	},

	select: function (e) {
		var this_ = this;
		if (e.target.parentNode.nodeName == "TD") {
			if (this.current.month != undefined) {
				this.current.day = +u(e.target).text();
				this.element.value = LC.formatDate(new Date(this.current.year, this.current.month, this.current.day));
				this.element.focus();
				this.close(); }
			else
			if (this.current.year != undefined)
				this.DOM.year.puff({ duration: 300 }, function () {
					this_.DOM.month.show();
					this_.month(this_.current.year, u("button", this_.DOM.year).indexOf(e.target), 1);
				});
			else
				this.DOM.decade.puff({ duration: 300 }, function () {
					this_.DOM.year.show();
					this_.year(+u(e.target).text());
				}); }
		else
		if (e.target.parentNode == this.DOM.switcher.up()[0])
			if (this.current.month != undefined)
				this.DOM.month.suck({ duration: 300 }, function () {
					this_.DOM.year.show();
					this_.year(this_.current.year); });
			else
			if (this.current.year != undefined)
				this.DOM.year.suck({ duration: 300 }, function () {
					this_.DOM.decade.show();
					this_.decade(this_.current.year); });
	},

	decade: function (year, selectYear) {
		this.current.decade = year - year % 20;
		this.current.year = undefined;
		this.current.month = undefined;
		var from = this.current.decade + 1;
		selectYear = selectYear || from;
		this.DOM.switcher.text(from + " - " + (from + 19));
		this.DOM.decade.empty();
		for (var i = 0, r, y; i < 20; i++) {
			r = i % 4 ? r : this.DOM.decade.append("tr");
			y = r.append("td").append("button", from + i).hide();
			(function (y, i) { setTimeout(function () {
				y.fadeIn({ duration: 300 },
				selectYear == from + i ? function () { y[0].focus(); } : undefined);
			}, i * 10); })(y, i); }
		this.DOM.main.anim({ height: this.DOM.switcher.size().height + this.DOM.decade.size().height });
	},

	year: function (year, selectMonth) {
		selectMonth = selectMonth || 0;
		this.current.year = year;
		this.current.month = undefined;
		this.DOM.switcher.text(year);
		this.DOM.year.empty();
		for (var i = 0, r, m; i < 12; i++) {
			r = i % 3 ? r : this.DOM.year.append("tr");
			m = r.append("td").append("button", LC.MONTHS[i].slice(0, 3) + " '" + (''+year).slice(-2)).hide();
			(function (m, i) { setTimeout(function () {
				m.fadeIn({ duration: 300 },
				selectMonth == i ? function () { m[0].focus(); } : undefined);
			}, i * 10); })(m, i); }
		this.DOM.main.anim({ height: this.DOM.switcher.size().height + this.DOM.year.size().height });
	},

	month: function (year, month, selectDay) {
		selectDay = selectDay || 1;
		var date = new Date(year, month, 1);
		this.current.year = date.getFullYear();
		this.current.month = date.getMonth();
		this.DOM.switcher.text(LC.MONTHS[this.current.month] + " " + this.current.year);
		this.DOM.month.children().exclude(":first").remove();
		for (var day = 1, i = 0, w, d,
		firstWeekDay = date.getDay(),
		last = new Date(new Date(year, month + 1, 1) - 86400000).getDate(); day <= last; i++) {
			w = i % 7 ? w : this.DOM.month.append("tr");
			d = w.append("td").append("button", day).hide();
			i >= firstWeekDay && (function (d, day) { setTimeout(function () {
				d.fadeIn({ duration: 300 },
				selectDay == day ? function () { d[0].focus(); } : undefined);
			}, day * 10); })(d, day++); }
		this.DOM.main.anim({ height: this.DOM.switcher.size().height + this.DOM.month.size().height });
	},

	prevPage: function () {
		if (this.current.month != undefined)
			this.month(this.current.year, this.current.month - 1);
		else
		if (this.current.year != undefined)
			this.year(this.current.year - 1);
		else
			this.decade(this.current.decade - 1); },

	nextPage: function () {
		if (this.current.month != undefined)
			this.month(this.current.year, this.current.month + 1);
		else
		if (this.current.year != undefined)
			this.year(this.current.year + 1);
		else
			this.decade(this.current.decade + 21); }
})},

// methods for elements
{},

// initializer
function () {
	for (var i = -1, els = u(".calendar"); els[++i];)
		new u.Calendar(els[i]);
});

})()