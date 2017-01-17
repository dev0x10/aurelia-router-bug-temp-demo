define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config) {
            config.map([
                { route: ['', 'index'], name: 'index', moduleId: 'pages/index' },
                { route: 'about', name: 'about', moduleId: 'pages/about', nav: true }
            ]);
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('pages/about',["require", "exports"], function (require, exports) {
    "use strict";
    var About = (function () {
        function About() {
        }
        return About;
    }());
    exports.About = About;
});

define('pages/index',["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index() {
            this.todos = [
                { title: '编号 001', done: false },
                { title: '编号 002', done: false },
                { title: '编号 003', done: false },
                { title: '编号 004', done: false },
                { title: '编号 005', done: false },
                { title: '编号 006', done: false }
            ];
        }
        Index.prototype.remove = function (todo) {
            var index = this.todos.indexOf(todo);
            if (index > -1) {
                this.todos.splice(index, 1);
            }
        };
        return Index;
    }());
    exports.Index = Index;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config.globalResources([
            './elements/view-container'
        ]);
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/view-container',["require", "exports", "aurelia-dependency-injection", "aurelia-binding", "aurelia-templating", "aurelia-router", "aurelia-metadata", "aurelia-pal"], function (require, exports, aurelia_dependency_injection_1, aurelia_binding_1, aurelia_templating_1, aurelia_router_1, aurelia_metadata_1, aurelia_pal_1) {
    "use strict";
    var SwapStrategies = (function () {
        function SwapStrategies() {
        }
        SwapStrategies.prototype.before = function (viewSlot, previousView, callback) {
            var promise = Promise.resolve(callback());
            if (previousView !== undefined) {
                return promise.then(function () { return viewSlot.remove(previousView, true); });
            }
            return promise;
        };
        SwapStrategies.prototype.with = function (viewSlot, previousView, callback) {
            var promise = Promise.resolve(callback());
            if (previousView !== undefined) {
                return Promise.all([viewSlot.remove(previousView, true), promise]);
            }
            return promise;
        };
        SwapStrategies.prototype.after = function (viewSlot, previousView, callback) {
            return Promise.resolve(viewSlot.removeAll(true)).then(callback);
        };
        return SwapStrategies;
    }());
    var swapStrategies = new SwapStrategies();
    var RouterView = (function () {
        function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
            this.element = element;
            this.container = container;
            this.viewSlot = viewSlot;
            this.router = router;
            this.viewLocator = viewLocator;
            this.compositionTransaction = compositionTransaction;
            this.compositionEngine = compositionEngine;
            this.router.registerViewPort(this, this.element.getAttribute('name'));
            if (!('initialComposition' in compositionTransaction)) {
                compositionTransaction.initialComposition = true;
                this.compositionTransactionNotifier = compositionTransaction.enlist();
            }
        }
        RouterView.prototype.created = function (owningView) {
            this.owningView = owningView;
        };
        RouterView.prototype.bind = function (bindingContext, overrideContext) {
            this.container.viewModel = bindingContext;
            this.overrideContext = overrideContext;
        };
        RouterView.prototype.process = function (viewPortInstruction, waitToSwap) {
            var _this = this;
            var component = viewPortInstruction.component;
            var childContainer = component.childContainer;
            var viewModel = component.viewModel;
            var viewModelResource = component.viewModelResource;
            var metadata = viewModelResource.metadata;
            var config = component.router.currentInstruction.config;
            var viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] : {};
            var layoutInstruction = {
                viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
                view: viewPort.layoutView || config.layoutView || this.layoutView,
                model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
                router: viewPortInstruction.component.router,
                childContainer: childContainer,
                viewSlot: this.viewSlot
            };
            var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
            if (viewStrategy && component.view) {
                viewStrategy.makeRelativeTo(aurelia_metadata_1.Origin.get(component.router.container.viewModel.constructor).moduleId);
            }
            return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true)
                .then(function (viewFactory) {
                if (!_this.compositionTransactionNotifier) {
                    _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
                }
                if (layoutInstruction.viewModel || layoutInstruction.view) {
                    viewPortInstruction.layoutInstruction = layoutInstruction;
                }
                viewPortInstruction.controller = metadata.create(childContainer, aurelia_templating_1.BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory));
                if (waitToSwap) {
                    return;
                }
                _this.swap(viewPortInstruction);
            });
        };
        RouterView.prototype.swap = function (viewPortInstruction) {
            var _this = this;
            var layoutInstruction = viewPortInstruction.layoutInstruction;
            var previousView = this.view;
            var work = function () {
                var swapStrategy;
                var viewSlot = _this.viewSlot;
                swapStrategy = _this.swapOrder in swapStrategies
                    ? swapStrategies[_this.swapOrder]
                    : swapStrategies.after;
                swapStrategy(viewSlot, previousView, function () {
                    return Promise.resolve().then(function () {
                        return viewSlot.add(_this.view);
                    }).then(function () {
                        _this._notify();
                    });
                });
            };
            var ready = function (owningView) {
                viewPortInstruction.controller.automate(_this.overrideContext, owningView);
                if (_this.compositionTransactionOwnershipToken) {
                    return _this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
                        _this.compositionTransactionOwnershipToken = null;
                        return work();
                    });
                }
                return work();
            };
            if (layoutInstruction) {
                if (!layoutInstruction.viewModel) {
                    layoutInstruction.viewModel = {};
                }
                return this.compositionEngine.createController(layoutInstruction).then(function (controller) {
                    aurelia_templating_1.ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
                    controller.automate(aurelia_binding_1.createOverrideContext(layoutInstruction.viewModel), _this.owningView);
                    controller.view.children.push(viewPortInstruction.controller.view);
                    return controller.view || controller;
                }).then(function (newView) {
                    _this.view = newView;
                    return ready(newView);
                });
            }
            this.view = viewPortInstruction.controller.view;
            return ready(this.owningView);
        };
        RouterView.prototype._notify = function () {
            if (this.compositionTransactionNotifier) {
                this.compositionTransactionNotifier.done();
                this.compositionTransactionNotifier = null;
            }
        };
        return RouterView;
    }());
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], RouterView.prototype, "swapOrder", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], RouterView.prototype, "layoutView", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], RouterView.prototype, "layoutViewModel", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], RouterView.prototype, "layoutModel", void 0);
    RouterView = __decorate([
        aurelia_templating_1.customElement('view-container'),
        aurelia_templating_1.noView,
        aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element, aurelia_dependency_injection_1.Container, aurelia_templating_1.ViewSlot, aurelia_router_1.Router, aurelia_templating_1.ViewLocator, aurelia_templating_1.CompositionTransaction, aurelia_templating_1.CompositionEngine),
        __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
    ], RouterView);
    exports.RouterView = RouterView;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./app.css\"></require>\n\n    <div class=\"statusbar-overlay\"></div>\n\n    <div class=\"views\">\n        <div class=\"view view-main\">\n\n            <!--这里的不是 aurelia 的 router-view-->\n            <view-container class=\"pages navbar-fixed\" swap-order=\"before\"></view-container>\n\n        </div>\n    </div>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "view-container{\n    display: block;\n}"; });
define('text!pages/about.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"page\">\n        <div class=\"navbar\">\n            <div class=\"navbar-inner\">\n                <div class=\"left\">\n                    <a href=\"#\" class=\"link icon-only\">\n                        <i class=\"icon icon-back\"></i>\n                    </a>\n                </div>\n                <div class=\"center sliding\">关于我们</div>\n                <div class=\"right\"></div>\n            </div>\n        </div>\n        <div class=\"page-content\">\n            <div class=\"content-block-title\">标题</div>\n            <div class=\"content-block\">\n                <p>这个内容</p>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!pages/index.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"page\">\n        <div class=\"navbar\">\n            <div class=\"navbar-inner\">\n                <div class=\"left\">\n                    <a class=\"link icon-only open-panel\">\n                        <i class=\"icon icon-bars\"></i>\n                    </a>\n                </div>\n                <div class=\"center sliding\">Framework7</div>\n                <div class=\"right\"></div>\n            </div>\n        </div>\n        <div class=\"page-content\">\n            <div class=\"content-block\">\n                <a href=\"#/about\" class=\"button button-big button-fill button-round active\">Add ToDo</a>\n            </div>\n            <div class=\"content-block-title\">Todos</div>\n            <div class=\"list-block\">\n                <ul>\n                    <li repeat.for=\"todo of todos\">\n                        <label class=\"label-checkbox item-content\">\n                            <input type=\"checkbox\" checked.bind=\"todo.done\">\n                            <div class=\"item-media\">\n                                <i class=\"icon icon-form-checkbox\"></i>\n                            </div>\n                            <div class=\"item-inner\">\n                                <div class=\"item-title\">${todo.title}</div>\n                                <div class=\"item-after\">\n                                    <button class=\"button color-red\" click.delegate=\"remove(todo)\">Remove</button>\n                                </div>\n                            </div>\n                        </label>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map