/**
 *  index
 *  ~~~~~~~~~~~~~~
 *
 *  description.
 *
 *  @copyright: (c) 2017 by slanxy.
 *  @license: MIT, see LICENSE for more details.
 */
import { TemplatingEngine } from 'aurelia-templating';

import {utils} from '../../lib/utils';


class Modal{
    static instance:any;
}


export function alert(text:any, title?:string, options?:Object) {
    return new Promise(resolve => {
        let engine = this.lazy(TemplatingEngine);
        let template = utils.parseHTML(`<ux-alert><h1>${text}</h1><p>${title}</p></ux-alert>`);

        // 添加到弹窗容器中
        Modal.instance.appendChild(template);



        utils.queueTask(() => engine.enhance({
            element: template,
            bindingContext: { resolve }
        }));
    });
  }