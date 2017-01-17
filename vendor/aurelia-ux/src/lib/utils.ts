/**
 *  utils
 *  ~~~~~~~~~~~~~~
 *
 *  description.
 *
 *  @copyright: (c) 2017 by slanxy.
 *  @license: MIT, see LICENSE for more details.
 */
import { Lazy, NewInstance, Container } from "aurelia-framework";
import { DOM } from "aurelia-pal";
import { TaskQueue } from "aurelia-task-queue";

// 私有变量
const TEMPLATE_DIV_ELEMENT: any = DOM.createElement('div');

export module utils {


    export function lazy(T:any):any{
        return Lazy.of(T).get(Container.instance)();
    }

    export function newInstance(T:any): any {
        return NewInstance.of(T).get(Container.instance);
    }

    export function isString(obj:any){
        return typeof obj === 'string';
    }

    export function queueTask(callback:Function){
        this.lazy(TaskQueue).queueTask(callback);
    }

    export function parseHTML(tpl:string){
        TEMPLATE_DIV_ELEMENT.innerHTML = tpl;
        return TEMPLATE_DIV_ELEMENT['children'][0];
    }
}