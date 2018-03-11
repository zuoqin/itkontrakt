"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./style.css");
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var targetUrl = 'http://www.orienteeringorganiser.com/api/exchangeRates';
var MainPage = (function (_super) {
    __extends(MainPage, _super);
    function MainPage() {
        var _this = _super.call(this) || this;
        _this.state = { items: [], selected: null };
        return _this;
    }
    MainPage.prototype.componentDidMount = function () {
        this.fetchData();
    };
    MainPage.prototype.fetchData = function () {
        var _this = this;
        fetch(proxyUrl + targetUrl)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.setState(__assign({}, _this.state, { items: data }));
        })
            .catch(function (error) {
            _this.setState(__assign({}, _this.state));
        });
    };
    MainPage.prototype.updateSelection = function (id) {
        this.setState(__assign({}, this.state, { selected: id }));
    };
    MainPage.prototype.updateitem = function (newrate) {
        var _this = this;
        var newitems = this.state.items.map(function (value) { if (value.Id == _this.state.selected) {
            value.Rate = newrate;
        } return value; });
        this.setState(__assign({}, this.state, { items: newitems }));
    };
    MainPage.prototype.render = function () {
        if (this.state.items.length == 0) {
            return (React.createElement("div", { className: "mainPage" },
                React.createElement("h2", null, "Display table of exchange rates ")));
        }
        else {
            return (React.createElement("div", { className: "mainPage" },
                React.createElement("h2", null, "Display table of exchange rates "),
                React.createElement(Table, { items: this.state.items, updateSelection: this.updateSelection.bind(this) }),
                React.createElement("button", { style: { display: this.state.selected == null ? 'none' : 'block' }, type: "button", className: "btn btn-primary", "data-toggle": "modal", "data-target": "#exampleModal" }, "Primary"),
                React.createElement(Dialog, { item: this.state.items.filter(item) }),
                "any => item.Id == this.state.selected)[0]} updateitem=",
                this.updateitem.bind(this),
                "/>"));
        }
    };
    return MainPage;
}(React.Component));
exports.MainPage = MainPage;
var Table = (function (_super) {
    __extends(Table, _super);
    function Table() {
        var _this = _super.call(this) || this;
        _this.state = { selectedOption: null };
        _this.handleOptionChange = _this.handleOptionChange.bind(_this);
        return _this;
    }
    Table.prototype.handleOptionChange = function (changeEvent) {
        this.setState({
            selectedOption: changeEvent.target.value
        });
        this.props.updateSelection(changeEvent.target.value.substring(6));
    };
    Table.prototype.renderPiece = function (value, index) {
        return (React.createElement("tr", { key: index },
            React.createElement("th", { scope: "row" }, value.Id),
            React.createElement("td", null, value.Date),
            React.createElement("td", null, value.CurrencyPair),
            React.createElement("td", null, value.Rate),
            React.createElement("td", null,
                React.createElement("input", { type: "radio", value: 'chkbox' + value.Id, checked: this.state.selectedOption === ('chkbox' + value.Id), onChange: this.handleOptionChange }))));
    };
    Table.prototype.renderList = function () {
        var a = this;
        return this.props.items.map(function (value, index) {
            return a.renderPiece(value, index);
        });
    };
    Table.prototype.render = function () {
        return (React.createElement("table", { className: "table" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { scope: "col" }, "ID"),
                    React.createElement("th", { scope: "col" }, "Date"),
                    React.createElement("th", { scope: "col" }, "Currency"),
                    React.createElement("th", { scope: "col" }, "Rate"),
                    React.createElement("th", { scope: "col" }, "Selected"))),
            React.createElement("tbody", null, this.renderList())));
    };
    return Table;
}(React.Component));
exports.default = Table;
var Dialog = (function (_super) {
    __extends(Dialog, _super);
    function Dialog(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { rate: 1.4 };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.savenewrate = _this.savenewrate.bind(_this);
        return _this;
    }
    Dialog.prototype.handleChange = function (event) {
        this.setState({ rate: event.target.value });
    };
    Dialog.prototype.componentWillReceiveProps = function (nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.item.Rate !== this.state.rate) {
            this.setState(__assign({}, this.state, { rate: nextProps.item.Rate }));
        }
    };
    Dialog.prototype.savenewrate = function () {
        var newitem = Object.assign({}, this.props.item);
        newitem.Rate = this.state.rate;
        this.props.updateitem(this.state.rate);
        fetch(proxyUrl + targetUrl, { method: 'PUT', body: newitem, headers: {
                "Content-Type": "application/json"
            }, });
    };
    Dialog.prototype.render = function () {
        if (this.props.item === undefined) {
            return (React.createElement("div", null));
        }
        else {
            return (React.createElement("div", { className: "modal fade", id: "exampleModal", tabIndex: "-1", role: "dialog", "aria-labelledby": "exampleModalLabel", "aria-hidden": "true" },
                React.createElement("div", { className: "modal-dialog", role: "document" },
                    React.createElement("div", { className: "modal-content" },
                        React.createElement("div", { className: "modal-header" },
                            React.createElement("h5", { className: "modal-title", id: "exampleModalLabel" }, "Change rate"),
                            React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                        React.createElement("div", { className: "modal-body" },
                            React.createElement("div", { className: "row" }),
                            React.createElement("div", { className: "row" },
                                React.createElement("div", { className: "col-md-1" },
                                    React.createElement("span", null, this.props.item.Id)),
                                React.createElement("div", { className: "col-md-4" },
                                    React.createElement("span", null, this.props.item.Date)),
                                React.createElement("div", { className: "col-md-3" },
                                    React.createElement("span", null, this.props.item.CurrencyPair)),
                                React.createElement("div", { className: "col-md-2" },
                                    React.createElement("input", { type: "number", id: "rate", value: this.state.rate, onChange: this.handleChange, step: "0.01" })))),
                        React.createElement("div", { className: "modal-footer" },
                            React.createElement("button", { type: "button", className: "btn btn-secondary", "data-dismiss": "modal" }, "Close"),
                            React.createElement("button", { type: "button", className: "btn btn-primary", onClick: this.savenewrate, "data-dismiss": "modal" }, "Save changes"))))));
        }
    };
    return Dialog;
}(React.Component));
//# sourceMappingURL=MainPage.js.map