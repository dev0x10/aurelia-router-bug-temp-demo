// 
// @description : 
// @author      : Adarsh Pastakia
// @copyright   : 2017
// @license     : MIT
import {autoinject, customElement, bindable, bindingMode, children, inlineView, useView, containerless, View, DOM} from 'aurelia-framework';
import {UIBaseInput} from "./ui-input";
import {UIEvent} from "../../utils/ui-event";
import {UIUtils} from "../../utils/ui-utils";
import {UIConstants} from "../../utils/ui-constants";

@autoinject()
@customElement('ui-markdown')
@inlineView(`<template class="ui-md-editor ui-input-wrapper"><ui-toolbar start click.trigger="toolClicked($event)">
  <div class="ui-button-group ui-horizontal">
  <ui-button data-id="h1" disabled.bind="disableTools||disabled||readonly" square small light>H1</ui-button>
  <ui-button data-id="h2" disabled.bind="disableTools||disabled||readonly" square small light>H2</ui-button>
  <ui-button data-id="h3" disabled.bind="disableTools||disabled||readonly" square small light>H3</ui-button>
  <ui-button data-id="h4" disabled.bind="disableTools||disabled||readonly" square small light>H4</ui-button>
  <ui-button data-id="h5" disabled.bind="disableTools||disabled||readonly" square small light>H5</ui-button>
  <ui-button data-id="h6" disabled.bind="disableTools||disabled||readonly" square small light>H6</ui-button>
  </div>
  <div class="ui-button-group ui-horizontal">
  <ui-button glyph="ui-md-bold" data-id="b" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  <ui-button glyph="ui-md-italic" data-id="i" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  <ui-button glyph="ui-md-strike" data-id="s" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  </div>
  <div class="ui-button-group ui-horizontal">
  <ui-button glyph="ui-md-link" data-id="a" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  <ui-button glyph="ui-md-image" data-id="img" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  </div>
  <div class="ui-button-group ui-horizontal">
  <ui-button glyph="ui-md-list" data-id="ul" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  <ui-button glyph="ui-md-number" data-id="ol" disabled.bind="disableTools||disabled||readonly" square small light></ui-button>
  </div>
  <div class="ui-button-group ui-horizontal">
  <ui-button glyph="ui-md-help" data-id="help" disabled.bind="disabled||readonly" square small light></ui-button>
  <ui-button glyph="ui-md-preview" data-id="preview" disabled.bind="disabled||readonly" square small light></ui-button>
  </div></ui-toolbar>
  <div class="ui-watermark \${preview?'preview':''} \${help?'help':''}">
  <div role="input" class="ui-input-control ui-textarea"><span class="ui-error" if.bind="errors"><ui-glyph glyph="ui-invalid"></ui-glyph><ul class="ui-error-list"><li repeat.for="err of errors" innerhtml.bind="err"></li></ul></span>
  <textarea ref="inputEl" value.bind="value" rows.bind="rows" maxlength.bind="maxlength" dir.bind="dir"
    focus.trigger="fireEvent($event)" blur.trigger="fireEvent($event)"
    input.trigger="fireEvent($event)" change.trigger="fireEvent($event)"
    placeholder.bind="placeholder" disabled.bind="isDisabled" readonly.bind="readonly"></textarea>
  <span class="ui-clear" if.bind="clear && value" click.trigger="clearInput()">&times;</span>
  <span class="ui-counter" if.bind="counter" innerhtml.bind="value.length + ' of ' + maxlength"></span>
  </div>
  
  <div class='ui-md-preview ui-pad-all ui-markdown' show.bind="help" dir="ltr">
  <h2 class="ui-small-caps ui-text-primary ui-strong">Markdown Syntax</h2>
  <hr/>
  <p>Add a blank line to create a separate paragraph</p>
  <hr/>
  <p class="ui-text-primary">Headers</p>

  <div>
      <span>H1 <code class="ui-selectable"># Header</code> <h1 class="ui-inline">Header</h1></span>
      <br/>
      <span>H2 <code class="ui-selectable">## Header</code> <h2 class="ui-inline">Header</h2></span>
      <br/>
      <span>H3 <code class="ui-selectable">### Header</code> <h3 class="ui-inline">Header</h3></span>
      <br/>
      <span>H4 <code class="ui-selectable">#### Header</code> <h4 class="ui-inline">Header</h4></span>
      <br/>
      <span>H5 <code class="ui-selectable">##### Header</code> <h5 class="ui-inline">Header</h5></span>
      <br/>
      <span>H6 <code class="ui-selectable">###### Header</code> <h6 class="ui-inline">Header</h6></span>
      <br/>
  </div>

  <p class="ui-text-primary">Styles</p>

  <p>
      <span>Italic <code class="ui-selectable">_Italic Text_</code>: <i>Italic</i></span>
      <br/>
      <span>Bold <code class="ui-selectable">__Bold Text__</code>: <b>Bold</b></span>
      <br/>
      <span>Strikethrough <code class="ui-selectable">~~Strikethrough~~</code>: <del>Strikethrough</del></span>
      <br/>
  </p>

  <p class="ui-text-primary">Links</p>

  <p>
      <code class="ui-selectable">[link text](link URL)</code>
      <br/>
      <em>any url will be converted to a link, use the above to display custom text instead of url in the link.</em>
      <br/>
      <span>eg. <code>&lt;a href="url">Link Text&lt;/a></code></span>
      <br/>
  </p>

  <p class="ui-text-primary">Images</p>

  <p>
      <code class="ui-selectable">![alt text](image URL)</code>
      <br/>
  </p>

  <p class="ui-text-primary">Lists</p>

  <p>
      <span><code class="ui-selectable">* list item</code>: &#8226; list item</span>
      <br/>
      <span><code class="ui-selectable">* list item</code>: &#8226; list item</span>
      <br/>
      <span><code class="ui-selectable">* list item</code>: &#8226; list item</span>
      <br/>
      <br/>
      <span><code class="ui-selectable">1. list item</code>: 1. list item</span>
      <br/>
      <span><code class="ui-selectable">* &nbsp;list item</code>: 2. list item</span>
      <br/>
      <span><code class="ui-selectable">* &nbsp;list item</code>: 3. list item</span>
      <br/>
  </p>

  <p class="ui-text-primary">Tables</p>

  <p>
      <span><code class="ui-selectable">|Head|Head |Head|</code></span>
      <br/>
      <span><code class="ui-selectable">|:---|:---:|---:|</code></span>
      <br/>
      <span><code class="ui-selectable">|Left Align|Center Align|Right Aligned|</code></span>
      <br/>
      <span><code class="ui-selectable">|Left Align|Center Align|Right Aligned|</code></span>
      <br/>
      <br/>
      <table>
          <thead>
              <tr>
                  <th class="ui-text-start">Head</th>
                  <th class="ui-text-center">Head</th>
                  <th class="ui-text-end">Head</th>
              </tr>
          </thead>
          <tr>
              <td class="ui-text-start">Left</td>
              <td class="ui-text-center">Center</td>
              <td class="ui-text-end">Right</td>
          </tr>
          <tr>
              <td class="ui-text-start">Left</td>
              <td class="ui-text-center">Center</td>
              <td class="ui-text-end">Right</td>
          </tr>
      </table>
  </p>
  <br/>
  <br/></div>
  
  <div class="ui-md-preview ui-pad-all ui-markdown" dir.bind="dir" show.bind="preview" innerhtml.bind="value | markdown" dir.bind="dir"></div>
  
  </div>
  <div class="ui-input-info" if.bind="info" innerhtml.bind="info"></div>
</template>`)
export class UIMarkdown extends UIBaseInput {
  constructor(public element: Element) {
    super();
    this.clear = element.hasAttribute('clear');
    this.counter = element.hasAttribute('counter');
  }

  // aurelia hooks
  created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    super.bind.apply(this, arguments);
  }
  attached() { }
  detached() { }
  unbind() { }
  // end aurelia hooks

  @bindable({ defaultBindingMode: bindingMode.twoWay }) value = '';

  @bindable() dir = '';
  @bindable() rows = 15;
  @bindable() errors = null;
  @bindable() maxlength = 5000;
  @bindable() disabled = false;
  @bindable() readonly = false;
  @bindable() placeholder = '';
  @bindable() autoComplete = '';
  @bindable() info = '';

  private clear = false;
  private counter = false;

  private ignore = false;

  private help = false;
  private preview = false;
  private disableTools = false;

  toolClicked(evt) {
    let btn;
    if (!(btn = getParentByTag(evt.target, 'ui-button'))) return;
    if (!(btn = btn['dataset']["id"])) return;

    let val = this.value || '';
    let diff = 0,
      start = this.inputEl.selectionStart,
      end = this.inputEl.selectionEnd,
      sub = val.substr(start, end - start) || 'EditThis';

    switch (btn) {
      case 'h1':
        diff = 3; this.value = val.substr(0, start) + `\n# ${sub}\n\n` + val.substr(end); break;
      case 'h2':
        diff = 4; this.value = val.substr(0, start) + `\n## ${sub}\n\n` + val.substr(end); break;
      case 'h3':
        diff = 5; this.value = val.substr(0, start) + `\n### ${sub}\n\n` + val.substr(end); break;
      case 'h4':
        diff = 6; this.value = val.substr(0, start) + `\n#### ${sub}\n\n` + val.substr(end); break;
      case 'h5':
        diff = 7; this.value = val.substr(0, start) + `\n##### ${sub}\n\n` + val.substr(end); break;
      case 'h6':
        diff = 8; this.value = val.substr(0, start) + `\n###### ${sub}\n\n` + val.substr(end); break;
      case 'b':
        diff = 3; this.value = val.substr(0, start) + ` ${sub} ` + val.substr(end); break;
      case 'i':
        diff = 2; this.value = val.substr(0, start) + ` _${sub}_ ` + val.substr(end); break;
      case 's':
        diff = 3; this.value = val.substr(0, start) + ` ~~${sub}~~ ` + val.substr(end); break;
      case 'a':
        diff = 2; this.value = val.substr(0, start) + ` [${sub}](Link_Url_Here) ` + val.substr(end); break;
      case 'img':
        diff = 3; this.value = val.substr(0, start) + ` ![${sub}](Image_Url_Here) ` + val.substr(end); break;
      case 'ul':
        diff = 2;
        sub = sub.replace(/^.+$/gm, (t) => `* ${t}`);
        this.value = val.substr(0, start) + `${sub}\n` + val.substr(end); break;
      case 'ol':
        var i = 1;
        diff = 3;
        sub = sub.replace(/^.+$/gm, (t) => `${i++ == 1 ? '1.' : '*'} ${t}`);
        this.value = val.substr(0, start) + `${sub}\n` + val.substr(end); break;
      case 'help':
        this.preview = false; this.disableTools = this.help = !this.help; break;
      case 'preview':
        this.help = false; this.disableTools = this.preview = !this.preview; break;
    }
    this.inputEl.focus();
    if (sub == 'EditThis' && btn != 'preview' && btn != 'help') UIEvent.queueTask(() => this.inputEl.setSelectionRange(start + diff, start + diff + sub.length));
  }
}

@autoinject()
@inlineView(`<template class="ui-input-wrapper ui-input-list"><div role="input" class="ui-input-control">
  <span class="ui-input-addon" click.trigger="openDropdown($event, show=true, inputEl.focus())"><ui-glyph glyph="ui-language"></ui-glyph></span>
  <span class="ui-error" if.bind="errors"><ui-glyph glyph="ui-invalid"></ui-glyph><ul class="ui-error-list"><li repeat.for="err of errors" innerhtml.bind="err"></li></ul></span>
  <input ref="inputEl" type.bind="type" value.bind="elValue" size="10"
    focus.trigger="fireEvent($event)" blur.trigger="fireEvent($event)"
    change.trigger="fireEvent($event)" placeholder.bind="placeholder"
    disabled.bind="isDisabled" readonly.bind="true" click.trigger="openDropdown($event, show=true)"/>
  <span class="ui-input-addon ui-dropdown-handle" click.trigger="openDropdown($event, show=true, inputEl.focus())"><ui-glyph glyph="ui-chevron-down"></ui-glyph></span></div>
  <div class="ui-input-info" if.bind="info" innerhtml.bind="info"></div>
  
  <div class="ui-list-container ui-floating" ref="dropdown">
    <div class="ui-list-group" t="Selected">Selected</div>
    <div class="ui-lang-item" repeat.for="item of selectedList">
      <div class="ui-list-item \${item.id==value?'ui-selected':''} \${item.disabled?'ui-disabled':''}" 
      mouseover.delegate="hilightItem($event)" click.trigger="fireSelect(item)"><ui-glyph glyph="ui-invalid" if.bind="errored.indexOf(item.id)>-1"></ui-glyph> \${item.name}</div>
      <ui-glyph class="ui-text-danger ui-font-big" glyph="ui-tree-collapse" click.trigger="removeLanguage(item)"></ui-glyph>
    </div>
    <div class="ui-list-group" t="Available">Available</div>
    <div class="ui-lang-item" repeat.for="item of availableList" click.trigger="addLanguage(item)">
      <div class="ui-list-item \${item.disabled?'ui-disabled':''}" innerhtml.bind="item.name" 
      mouseover.delegate="hilightItem($event)"></div>
      <ui-glyph class="ui-text-info ui-font-big" glyph="ui-tree-expand"></ui-glyph>
    </div>
    </template>
  </div>
</template>`)
@customElement('ui-language')
export class UILanguage {
  constructor(public element: Element) { }

  // aurelia hooks
  created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    this.languagesChanged(this.languages);
  }
  attached() {
    this.tether = UIUtils.tether(this.element, this.dropdown);
    this.obMouseup = UIEvent.subscribe('mouseclick', (evt) => {
      if (getParentByClass(evt.target, 'ui-list-container') == this.dropdown) {
        clearTimeout(this.closing);
        return true;
      }
      this.closeDropdown();
    });
  }
  detached() {
    this.tether.dispose();
    this.obMouseup.dispose();
  }
  unbind() { }
  // end aurelia hooks

  @bindable({ defaultBindingMode: bindingMode.twoWay }) value = '';
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dir = '';

  @bindable() errors = null;
  @bindable() disabled = false;
  @bindable() readonly = false;
  @bindable() info = '';
  @bindable() languages;
  @bindable() placeholder = '';

  errored = [];
  show = false;

  private inputEl;
  private elValue;
  private dropdown;

  private tether;
  private closing;
  private obMouseup;

  private selectedList = [];
  private availableList = [];

  valueChanged(newValue) {
    let l = _.find(this.selectedList, ['id', newValue]) || {};
    this.dir = (l.rtl ? 'rtl' : 'ltr');
    this.elValue = l.name;
  }

  languagesChanged(newValue) {
    this.selectedList = [];
    this.availableList = _.clone(UIConstants.Languages);
    if (!isEmpty(newValue)) {
      let langs = isString(newValue) ? newValue.split(',') : newValue;
      _.forEach(langs, l => this.selectedList = this.selectedList.concat(_.remove(this.availableList, ['id', l])));
      this.value = langs[0];
    }
  }

  fireEvent(evt) {
    evt.stopPropagation();
    let el = getParentByClass(this.element, 'ui-input-group');
    if (evt.type === 'focus') {
      this.inputEl.select();
      this.element.classList.add('ui-focus');
      if (el) el.classList.add('ui-focus');
      if (this.show) this.openDropdown();
    }
    if (evt.type === 'blur') {
      this.element.classList.remove('ui-focus');
      if (el) el.classList.remove('ui-focus');
      this.closing = setTimeout(() => this.closeDropdown(), 500);
    }
    UIEvent.fireEvent(evt.type, this.element, this.value);
  }

  hilightItem(evt) {
    let h = this.dropdown.querySelector('.ui-list-item.ui-hilight');
    if (h !== null) h.classList.remove('ui-hilight');
    evt.target.classList.add('ui-hilight');
  }
  unhilightItem(evt) {
    let h = this.dropdown.querySelector('.ui-list-item.ui-hilight');
    if (h !== null) h.classList.remove('ui-hilight');
  }

  scrollIntoView() {
    let h = this.dropdown.querySelector('.ui-list-item.ui-hilight');
    if (h == null) h = this.dropdown.querySelector('.ui-list-item.ui-selected');
    this.dropdown.scrollTop = (h !== null ? h.offsetTop - (this.dropdown.offsetHeight / 2) : 0);
  }

  openDropdown() {
    if (this.readonly || this.disabled) return true;
    this.dropdown.isOpen = true;
    this.dropdown.classList.add('ui-open');
    this.tether.position();
    this.scrollIntoView();
  }

  closeDropdown() {
    if (!this.dropdown) return;
    this.dropdown.isOpen = false;
    this.dropdown.classList.remove('ui-open');
  }

  toggleDropdown(evt, forceClose = false) {
    evt.stopPropagation();
    evt.cancelBubble = true;
    this.dropdown.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  addLanguage(model) {
    UIEvent.fireEvent('add', this.element, model);
    this.selectedList = this.selectedList.concat(_.remove(this.availableList, ['id', model.id]));
    this.value = model.id;
    this.closeDropdown();
  }

  removeLanguage(model) {
    UIEvent.fireEvent('remove', this.element, model);
    this.availableList = this.availableList.concat(_.remove(this.selectedList, ['id', model.id]));
    this.value = this.selectedList.length > 0 ? this.selectedList[0].id : '';
  }

  fireSelect(model) {
    this.value = model.id;
    this.closeDropdown();
    this.unhilightItem(null);
    UIEvent.fireEvent('change', this.element, model)
  }
}