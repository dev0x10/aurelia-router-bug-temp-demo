// 
// @description : 
// @author      : Adarsh Pastakia
// @copyright   : 2017
// @license     : MIT
import {autoinject, customElement, bindable, bindingMode, children, inlineView, useView, containerless, View, DOM} from 'aurelia-framework';
import {UIBaseInput} from "./ui-input";
import {UIEvent} from "../../utils/ui-event";
import {UIUtils} from "../../utils/ui-utils";
import * as moment from "moment";

@autoinject()
@inlineView(`<template class="ui-date-view" click.trigger="clicked($event)">
  <div class="ui-dv-date-wrapper">
    <div class="ui-dv-header">
      <a class="prev \${disablePrev?'disabled':''}"><ui-glyph glyph="ui-chevron-left"></ui-glyph></a>
      <a class="title">\${title}<ui-glyph glyph="ui-caret-up"></ui-glyph></a>
      <a class="next \${disableNext?'disabled':''}"><ui-glyph glyph="ui-chevron-right"></ui-glyph></a>
    </div>
    <div class="ui-dv-container">
      <div class="weekdays" if.bind="datePage==0">
        <span class="week">#</span>
        <span repeat.for="d of weekdays">\${d}</span>
      </div>
      <div repeat.for="w of dates" class="dates" if.bind="datePage==0">
        <span class="week">\${w.wk}</span>
        <span repeat.for="d of w.dt" date.bind="d" class="date hover \${dateClass(d)}">$\{d.date()}</span>
      </div>
      <div repeat.for="w of 4" class="months" if.bind="datePage==1">
        <span repeat.for="d of 3" month.bind="(w*3)+d" class="month hover \${monthClass((w*3)+d, current, minDate, maxDate)}">\${months[(w*3)+d]}</span>
      </div>
      <div repeat.for="w of 5" class="years" if.bind="datePage==2">
          <span repeat.for="d of 4" year.bind="(w*4)+d+decade" class="year hover \${yearClass((w*4)+d+decade, current, minDate, maxDate)}">\${(w*4)+d+decade}</span>
      </div>
    </div>
    <div class="ui-dv-footer">
      <a class="today" if.bind="datePage==0">Today</a>
      <a class="cancel" if.bind="datePage!=0">Cancel</a>
    </div>
  </div>
  <div class="ui-dv-time-wrapper"></div>
</template>`)
@customElement('ui-date-view')
export class UIDateView {
  constructor(public element: Element) {
    if (element.hasAttribute('time')) this.type = 't';
    if (element.hasAttribute('datetime')) this.type = 'dt';

    this.obLocale = UIEvent.subscribe('i18n:locale:changed', payload => this.buildDatePage(payload.newValue));
  }

  // aurelia hooks
  created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    if (this.date && moment(this.date).isValid()) this.date = moment(this.date).toISOString();
    if (this.date && moment(this.date).isValid()) this.current = moment(this.date);
    else if (this.minDate && moment(this.minDate).isValid() && moment().isBefore(this.minDate)) this.current = moment(this.minDate);
    else if (this.maxDate && moment(this.maxDate).isValid() && moment().isAfter(this.maxDate)) this.current = moment(this.maxDate);
    else this.current = moment();
  }
  attached() {
    this.buildDatePage();
  }
  detached() {
    this.obLocale.dispose();
  }
  unbind() { }
  // end aurelia hooks

  @bindable({ defaultBindingMode: bindingMode.twoWay }) date = '';

  @bindable() minDate;
  @bindable() maxDate;

  private type = 'd';
  private obLocale;

  private title = "";
  private datePage = 0;

  private hour = 0;
  private minute = 0;
  private current;
  private decade;

  private dates = [];
  private months = [];
  private weekdays = [];

  private disablePrev = false;
  private disableNext = false;


  dateChanged(newValue) {
    if (newValue && moment(newValue).isValid()) {
      this.refresh();
    }
  }

  minDateChanged(newValue) {
    if (this.date && moment(this.date).isBefore(this.minDate, 'date')) this.date = newValue;
    this.buildDatePage();
  }

  maxDateChanged(newValue) {
    if (this.date && moment(this.date).isAfter(this.maxDate, 'date')) this.date = newValue;
    this.buildDatePage();
  }

  private refresh() {
    if (this.minDate && moment(this.date).isBefore(this.minDate, 'date')) this.date = this.minDate;
    if (this.maxDate && moment(this.date).isAfter(this.maxDate, 'date')) this.date = this.maxDate;
    this.current = moment(this.date);
    this.buildDatePage();
  }

  private dateClass(dt) {
    let c = '';
    if (!dt.isSame(this.current, 'month')) c += ' muted ';
    if (dt.isSame(moment(), 'day')) c += ' today';
    if (this.date && dt.isSame(this.date, 'day')) c += ' selected';
    if (this.minDate && dt.isBefore(this.minDate, 'day')) c += ' disabled';
    if (this.maxDate && dt.isAfter(this.maxDate, 'day')) c += ' disabled';
    return c;
  }
  private monthClass(mn) {
    let c = '', m = moment(this.current.toISOString()).month(mn);
    if (this.minDate && m.isBefore(this.minDate, 'month')) c += ' disabled';
    if (this.maxDate && m.isAfter(this.maxDate, 'month')) c += ' disabled';
    return c;
  }
  private yearClass(yr) {
    let c = '', y = moment(this.current.toISOString()).year(yr);
    if (this.minDate && y.isBefore(this.minDate, 'year')) c += ' disabled';
    if (this.maxDate && y.isAfter(this.maxDate, 'year')) c += ' disabled';
    return c;
  }

  private buildDatePage(newLocale?) {
    if (!this.current.isValid || !this.current.isValid()) return;
    if (newLocale) moment.locale(newLocale);

    if (this.datePage == 0) {
      this.weekdays = moment.weekdaysMin();
      this.title = moment(this.current.toISOString()).format('MMMM YYYY');

      let start = moment(this.current).startOf('month');
      let end = moment(this.current).endOf('month');

      if (start.day() < 3) start.add(-7, 'day');
      start.add(start.day() * -1, 'day');
      end = end.add(6 - end.day(), 'day');

      this.dates = [];
      for (var w = 0; w < 6; w++) {
        let wk = { wk: moment(start).add(w, 'week').week(), dt: [] }
        for (var d = 0; d < 7; d++) {
          wk.dt.push(moment(start).add(w, 'week').add(d, 'day'));
        }
        this.dates.push(wk);
      }

      if (this.minDate) this.disablePrev = start.isBefore(this.minDate, 'month');
      if (this.maxDate) this.disableNext = end.isAfter(this.maxDate, 'month');
    }
    if (this.datePage == 1) {
      this.months = moment.months();
      this.title = moment(this.current.toISOString()).format('YYYY');

      let start = moment(this.current).startOf('year');
      let end = moment(this.current).endOf('year');

      if (this.minDate) this.disablePrev = start.isBefore(this.minDate, 'month');
      if (this.maxDate) this.disableNext = end.isAfter(this.maxDate, 'month');
    }
    if (this.datePage == 2) {
      this.decade = (this.current.year() - (this.current.year() % 20)) + 1;
      this.title = this.decade + '-' + (this.decade + 20);

      this.disablePrev = (this.minDate && this.decade <= moment(this.minDate).year());
      this.disableNext = (this.maxDate && this.decade + 20 >= moment(this.maxDate).year());
    }

  }

  private clicked(evt) {
    let changed = false
    if (evt.target.classList.contains('disabled')) return;

    if (evt.target.classList.contains('today')) {
      this.current = moment();
      changed = true;
    }
    else if (evt.target.classList.contains('date')) {
      this.current = moment(evt.target['date']);
      changed = true;
    }
    else if (evt.target.classList.contains('month')) {
      this.current.month(evt.target['month']);
      this.datePage = 0;
    }
    else if (evt.target.classList.contains('year')) {
      this.current.year(evt.target['year']);
      this.datePage = 1;
    }
    else if (evt.target.classList.contains('next')) {
      if (this.datePage == 0) {
        this.current = moment(this.current).add(1, 'month');
      }
      else if (this.datePage == 1) {
        this.current = moment(this.current).add(1, 'year');
      }
      else if (this.datePage == 2) {
        this.current = moment(this.current).add(20, 'year');
      }
    }
    else if (evt.target.classList.contains('prev')) {
      if (this.datePage == 0) {
        this.current = moment(this.current).add(-1, 'month');
      }
      else if (this.datePage == 1) {
        this.current = moment(this.current).add(-1, 'year');
      }
      else if (this.datePage == 2) {
        this.current = moment(this.current).add(-20, 'year');
      }
    }
    else if (evt.target.classList.contains('title')) {
      if (this.datePage != 2) this.datePage++;
    }
    else if (evt.target.classList.contains('cancel')) {
      this.datePage = 0;
    }
    this.buildDatePage();
    if (changed) {
      this.date = moment(this.current).hour(this.hour).minute(this.minute).toISOString();
      UIEvent.fireEvent('change', this.element, moment(this.date));
    }
  }
}

@autoinject()
@inlineView(`<template class="ui-input-wrapper ui-input-date"><div role="input" class="ui-input-control"><slot></slot>
  <span class="ui-error" if.bind="errors"><ui-glyph glyph="ui-invalid"></ui-glyph><ul class="ui-error-list"><li repeat.for="err of errors" innerhtml.bind="err"></li></ul></span>
  <input ref="inputEl" value.bind="elValue"
    focus.trigger="fireEvent($event)" blur.trigger="fireEvent($event)"
    change.trigger="fireEvent($event)" keydown.trigger="keyDown($event)" click.trigger="openDropdown($event, show=true)"
    placeholder.bind="placeholder" disabled.bind="isDisabled" readonly.bind="!allowSearch || readonly"/>
  <span class="ui-clear" if.bind="clear && value" click.trigger="clearInput()">&times;</span>
  <span class="ui-input-addon" click.trigger="openDropdown($event, show=true, inputEl.focus())"><ui-glyph glyph="ui-calendar"></ui-glyph></span></div>
  <div class="ui-input-info" if.bind="info" innerhtml.bind="info"></div>
  <ui-date-view ref="dropdown" class="ui-hidden floating" date.bind="date" min-date.bind="minDate" max-date.bind="maxDate"></ui-date-view>
</template>`)
@customElement('ui-date')
export class UIDateInput extends UIBaseInput {
  constructor(public element: Element) {
    super();
    this.clear = element.hasAttribute('clear');
    if (element.hasAttribute('time')) {
      this.type = 't';
      this.format = 'hh:mm A';
    }
    if (element.hasAttribute('datetime')) {
      this.type = 'dt';
      this.format = 'DD MMM YYYY hh:mm A';
    }
  }

  // aurelia hooks
  created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    super.bind.apply(this, arguments);
    if (!isEmpty(this.date) && moment(this.date).isValid()) {
      this.date = moment(this.date).toISOString();
      this.elValue = moment(this.date).format(this.format);
    }
  }
  attached() {
    this.tether = UIUtils.tether(this.element, this.dropdown, { resize: false });
    this.obMouseup = UIEvent.subscribe('mouseclick', (evt) => {
      if (getParentByClass(evt.target, 'ui-date-view') == this.dropdown) return true;
      this.closeDropdown();
    });
  }
  detached() {
    this.tether.dispose();
    this.obMouseup.dispose();
  }
  unbind() { }
  // end aurelia hooks

  @bindable({ defaultBindingMode: bindingMode.twoWay }) date = '';

  @bindable() minDate;
  @bindable() maxDate;
  @bindable() format = 'DD MMM YYYY';

  @bindable() width = 'auto';
  @bindable() errors = null;
  @bindable() disabled = false;
  @bindable() readonly = false;
  @bindable() info = '';
  @bindable() placeholder = '';

  private type = 'd';
  private elValue = '';

  private show = false;
  private clear = false;
  private ignore = false;

  private dropdown;

  protected tether;
  protected obMouseup;

  dateChanged(newValue) {
    if (newValue && moment(newValue).isValid()) this.elValue = moment(newValue).format(this.format);
    else this.elValue = '';
    this.inputEl.focus();
    this.closeDropdown();
    UIEvent.fireEvent('change', this.element, newValue || null);
  }

  openDropdown() {
    if (this.readonly || this.disabled) return true;
    this.dropdown.isOpen = true;
    this.dropdown.classList.remove('ui-hidden');
    this.dropdown.au.controller.viewModel.refresh();
    this.tether.position();
  }

  closeDropdown() {
    this.dropdown.isOpen = false;
    this.dropdown.classList.add('ui-hidden');
    this.dropdown.au.controller.viewModel.datePage = 0;
  }

  toggleDropdown(evt, forceClose = false) {
    evt.stopPropagation();
    evt.cancelBubble = true;
    this.dropdown.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  fireEvent(evt) {
    evt.stopPropagation();
    let el = getParentByClass(this.element, 'ui-input-group');
    if (evt.type === 'focus') {
      this.inputEl.select();
      this.element.classList.add('ui-focus');
      if (el) el.classList.add('ui-focus');
    }
    if (evt.type === 'blur') {
      this.element.classList.remove('ui-focus');
      if (el) el.classList.remove('ui-focus');
    }
    UIEvent.fireEvent(evt.type, this.element, this.date);
  }

  private keyDown(evt) {
    if (evt.ctrlKey || evt.altKey || evt.metaKey || (evt.keyCode || evt.which) === 0) return true;
    if (this.readonly || this.disabled) return true;
    let code = (evt.keyCode || evt.which);

    // OnEnterPress if dropdown closed, fire enterpressed
    if (code == 13 && !this.dropdown.isOpen) {
      return UIEvent.fireEvent('enterpressed', this.element, this);
    }
    if (code === 9) {
      this.closeDropdown();
      return true;
    }

    if (code === 38) {
      if (this.date && moment(this.date).isValid()) this.date = moment(this.date).add(1, 'day').toISOString();
      else this.date = moment().toISOString();
    }
    if (code === 40) {
      if (this.date && moment(this.date).isValid()) this.date = moment(this.date).add(-1, 'day').toISOString();
      else this.date = moment().toISOString();
    }
    if (code === 37) { //left
      if (this.date && moment(this.date).isValid()) this.date = moment(this.date).add(-1, 'month').toISOString();
      else this.date = moment().toISOString();
    }
    if (code === 39) { //right
      if (this.date && moment(this.date).isValid()) this.date = moment(this.date).add(1, 'month').toISOString();
      else this.date = moment().toISOString();
    }
  }
}