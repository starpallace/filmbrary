/*! =======================================================
                      VERSION  11.0.2              
========================================================= */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! =========================================================
 * bootstrap-bleeder.js
 *
 * Maintainers:
 *		Kyle Kemp
 *			- Twitter: @seiyria
 *			- Github:  seiyria
 *		Rohit Kalkur
 *			- Twitter: @Rovolutionary
 *			- Github:  rovolution
 *
 * =========================================================
 *
 * bootstrap-bleeder is released under the MIT License
 * Copyright (c) 2019 Kyle Kemp, Rohit Kalkur, and contributors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * ========================================================= */

/**
 * Bridget makes jQuery widgets
 * v1.0.1
 * MIT license
 */
var windowIsDefinedNew = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object";

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
		var jQuery;
		try {
			jQuery = require("jquery");
		} catch (err) {
			jQuery = null;
		}
		module.exports = factory(jQuery);
	} else if (window) {
		window.bleeder = factory(window.jQuery);
	}
})(function ($) {
	// Constants
	var NAMESPACE_MAIN = 'bleeder';
	var NAMESPACE_ALTERNATE = 'bootstrapbleeder';

	// Polyfill console methods
	if (windowIsDefinedNew && !window.console) {
		window.console = {};
	}
	if (windowIsDefinedNew && !window.console.log) {
		window.console.log = function () {};
	}
	if (windowIsDefinedNew && !window.console.warn) {
		window.console.warn = function () {};
	}

	// Reference to bleeder constructor
	var bleeder;

	(function ($) {

		'use strict';

		// -------------------------- utils -------------------------- //

		var slice = Array.prototype.slice;

		function noop() {}

		// -------------------------- definition -------------------------- //

		function defineBridget($) {

			// bail if no jQuery
			if (!$) {
				return;
			}

			// -------------------------- addOptionMethod -------------------------- //

			/**
    * adds option method -> $().plugin('option', {...})
    * @param {Function} PluginClass - constructor class
    */
			function addOptionMethod(PluginClass) {
				// don't overwrite original option method
				if (PluginClass.prototype.option) {
					return;
				}

				// option setter
				PluginClass.prototype.option = function (opts) {
					// bail out if not an object
					if (!$.isPlainObject(opts)) {
						return;
					}
					this.options = $.extend(true, this.options, opts);
				};
			}

			// -------------------------- plugin bridge -------------------------- //

			// helper function for logging errors
			// $.error breaks jQuery chaining
			var logError = typeof console === 'undefined' ? noop : function (message) {
				console.error(message);
			};

			/**
    * jQuery plugin bridge, access methods like $elem.plugin('method')
    * @param {String} namespace - plugin name
    * @param {Function} PluginClass - constructor class
    */
			function bridge(namespace, PluginClass) {
				// add to jQuery fn namespace
				$.fn[namespace] = function (options) {
					if (typeof options === 'string') {
						// call plugin method when first argument is a string
						// get arguments for method
						var args = slice.call(arguments, 1);

						for (var i = 0, len = this.length; i < len; i++) {
							var elem = this[i];
							var instance = $.data(elem, namespace);
							if (!instance) {
								logError("cannot call methods on " + namespace + " prior to initialization; " + "attempted to call '" + options + "'");
								continue;
							}
							if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
								logError("no such method '" + options + "' for " + namespace + " instance");
								continue;
							}

							// trigger method with arguments
							var returnValue = instance[options].apply(instance, args);

							// break look and return first value if provided
							if (returnValue !== undefined && returnValue !== instance) {
								return returnValue;
							}
						}
						// return this if no return value
						return this;
					} else {
						var objects = this.map(function () {
							var instance = $.data(this, namespace);
							if (instance) {
								// apply options & init
								instance.option(options);
								instance._init();
							} else {
								// initialize new instance
								instance = new PluginClass(this, options);
								$.data(this, namespace, instance);
							}
							return $(this);
						});

						if (objects.length === 1) {
							return objects[0];
						}
						return objects;
					}
				};
			}

			// -------------------------- bridget -------------------------- //

			/**
    * converts a Prototypical class into a proper jQuery plugin
    *   the class must have a ._init method
    * @param {String} namespace - plugin name, used in $().pluginName
    * @param {Function} PluginClass - constructor class
    */
			$.bridget = function (namespace, PluginClass) {
				addOptionMethod(PluginClass);
				bridge(namespace, PluginClass);
			};

			return $.bridget;
		}

		// get jquery from browser global
		defineBridget($);
	})($);

	/*************************************************
 			BOOTSTRAP-bleeder SOURCE CODE
 	**************************************************/

	(function ($) {
		var autoRegisterNamespace = void 0;

		var ErrorMsgs = {
			formatInvalidInputErrorMsg: function formatInvalidInputErrorMsg(input) {
				return "Invalid input value '" + input + "' passed in";
			},
			callingContextNotbleederInstance: "Calling context element does not have instance of bleeder bound to it. Check your code to make sure the JQuery object returned from the call to the bleeder() initializer is calling the method"
		};

		var bleederScale = {
			linear: {
				getValue: function getValue(value, options) {
					if (value < options.min) {
						return options.min;
					} else if (value > options.max) {
						return options.max;
					} else {
						return value;
					}
				},
				toValue: function toValue(percentage) {
					var rawValue = percentage / 100 * (this.options.max - this.options.min);
					var shouldAdjustWithBase = true;
					if (this.options.picks_positions.length > 0) {
						var minv,
						    maxv,
						    minp,
						    maxp = 0;
						for (var i = 1; i < this.options.picks_positions.length; i++) {
							if (percentage <= this.options.picks_positions[i]) {
								minv = this.options.picks[i - 1];
								minp = this.options.picks_positions[i - 1];
								maxv = this.options.picks[i];
								maxp = this.options.picks_positions[i];

								break;
							}
						}
						var partialPercentage = (percentage - minp) / (maxp - minp);
						rawValue = minv + partialPercentage * (maxv - minv);
						shouldAdjustWithBase = false;
					}

					var adjustment = shouldAdjustWithBase ? this.options.min : 0;
					var value = adjustment + Math.round(rawValue / this.options.step) * this.options.step;
					return bleederScale.linear.getValue(value, this.options);
				},
				toPercentage: function toPercentage(value) {
					if (this.options.max === this.options.min) {
						return 0;
					}

					if (this.options.picks_positions.length > 0) {
						var minv,
						    maxv,
						    minp,
						    maxp = 0;
						for (var i = 0; i < this.options.picks.length; i++) {
							if (value <= this.options.picks[i]) {
								minv = i > 0 ? this.options.picks[i - 1] : 0;
								minp = i > 0 ? this.options.picks_positions[i - 1] : 0;
								maxv = this.options.picks[i];
								maxp = this.options.picks_positions[i];

								break;
							}
						}
						if (i > 0) {
							var partialPercentage = (value - minv) / (maxv - minv);
							return minp + partialPercentage * (maxp - minp);
						}
					}

					return 100 * (value - this.options.min) / (this.options.max - this.options.min);
				}
			},

			logarithmic: {
				/* Based on http://stackoverflow.com/questions/846221/logarithmic-bleeder */
				toValue: function toValue(percentage) {
					var offset = 1 - this.options.min;
					var min = Math.log(this.options.min + offset);
					var max = Math.log(this.options.max + offset);
					var value = Math.exp(min + (max - min) * percentage / 100) - offset;
					if (Math.round(value) === max) {
						return max;
					}
					value = this.options.min + Math.round((value - this.options.min) / this.options.step) * this.options.step;
					/* Rounding to the nearest step could exceed the min or
      * max, so clip to those values. */
					return bleederScale.linear.getValue(value, this.options);
				},
				toPercentage: function toPercentage(value) {
					if (this.options.max === this.options.min) {
						return 0;
					} else {
						var offset = 1 - this.options.min;
						var max = Math.log(this.options.max + offset);
						var min = Math.log(this.options.min + offset);
						var v = Math.log(value + offset);
						return 100 * (v - min) / (max - min);
					}
				}
			}
		};

		/*************************************************
  						CONSTRUCTOR
  	**************************************************/
	  bleeder = function bleeder(element, options) {
			createNewbleeder.call(this, element, options);
			return this;
		};

		function createNewbleeder(element, options) {

			/*
   	The internal state object is used to store data about the current 'state' of bleeder.
   	This includes values such as the `value`, `enabled`, etc...
   */
			this._state = {
				value: null,
				enabled: null,
				offset: null,
				size: null,
				percentage: null,
				inDrag: false,
				over: false,
				pickIndex: null
			};

			// The objects used to store the reference to the pick methods if picks_tooltip is on
			this.picksCallbackMap = {};
			this.pandleCallbackMap = {};

			if (typeof element === "string") {
				this.element = document.querySelector(element);
			} else if (element instanceof HTMLElement) {
				this.element = element;
			}

			/*************************************************
   					Process Options
   	**************************************************/
			options = options ? options : {};
			var optionTypes = Object.keys(this.defaultOptions);

			var isMinSet = options.hasOwnProperty('min');
			var isMaxSet = options.hasOwnProperty('max');

			for (var i = 0; i < optionTypes.length; i++) {
				var optName = optionTypes[i];

				// First check if an option was passed in via the constructor
				var val = options[optName];
				// If no data attrib, then check data atrributes
				val = typeof val !== 'undefined' ? val : getDataAttrib(this.element, optName);
				// Finally, if nothing was specified, use the defaults
				val = val !== null ? val : this.defaultOptions[optName];

				// Set all options on the instance of the bleeder
				if (!this.options) {
					this.options = {};
				}
				this.options[optName] = val;
			}

			this.picksAreValid = Array.isArray(this.options.picks) && this.options.picks.length > 0;

			// Lock to picks only when picks[] is defined and set
			if (!this.picksAreValid) {
				this.options.lock_to_picks = false;
			}

			// Check options.rtl
			if (this.options.rtl === 'auto') {
				var computedStyle = window.getComputedStyle(this.element);
				if (computedStyle != null) {
					this.options.rtl = computedStyle.direction === 'rtl';
				} else {
					// Fix for Firefox bug in versions less than 62:
					// https://bugzilla.mozilla.org/show_bug.cgi?id=548397
					// https://bugzilla.mozilla.org/show_bug.cgi?id=1467722
					this.options.rtl = this.element.style.direction === 'rtl';
				}
			}

			/*
   	Validate `tooltip_position` against 'orientation`
   	- if `tooltip_position` is incompatible with orientation, switch it to a default compatible with specified `orientation`
   		-- default for "vertical" -> "right", "left" if rtl
   		-- default for "horizontal" -> "top"
   */
			if (this.options.orientation === "vertical" && (this.options.tooltip_position === "top" || this.options.tooltip_position === "bottom")) {
				if (this.options.rtl) {
					this.options.tooltip_position = "left";
				} else {
					this.options.tooltip_position = "right";
				}
			} else if (this.options.orientation === "horizontal" && (this.options.tooltip_position === "left" || this.options.tooltip_position === "right")) {

				this.options.tooltip_position = "top";
			}

			function getDataAttrib(element, optName) {
				var dataName = "data-bleeder-" + optName.replace(/_/g, '-');
				var dataValString = element.getAttribute(dataName);

				try {
					return JSON.parse(dataValString);
				} catch (err) {
					return dataValString;
				}
			}

			/*************************************************
   					Create Markup
   	**************************************************/

			var origWidth = this.element.style.width;
			var updatebleeder = false;
			var parent = this.element.parentNode;
			var bleederTrackSelection;
			var bleederTrackLow, bleederTrackHigh;
			var bleederMinpandle;
			var bleederMaxpandle;

			if (this.bleederElem) {
				updatebleeder = true;
			} else {
				/* Create elements needed for bleeder */
				this.bleederElem = document.createElement("div");
				this.bleederElem.className = "bleeder";

				/* Create bleeder track elements */
				var bleederTrack = document.createElement("div");
				bleederTrack.className = "bleeder-track";

				bleederTrackLow = document.createElement("div");
				bleederTrackLow.className = "bleeder-track-low";

				bleederTrackSelection = document.createElement("div");
				bleederTrackSelection.className = "bleeder-selection";

				bleederTrackHigh = document.createElement("div");
				bleederTrackHigh.className = "bleeder-track-high";

				bleederMinpandle = document.createElement("div");
				bleederMinpandle.className = "bleeder-pandle min-bleeder-pandle";
				bleederMinpandle.setAttribute('role', 'bleeder');
				bleederMinpandle.setAttribute('aria-valuemin', this.options.min);
				bleederMinpandle.setAttribute('aria-valuemax', this.options.max);

				bleederMaxpandle = document.createElement("div");
				bleederMaxpandle.className = "bleeder-pandle max-bleeder-pandle";
				bleederMaxpandle.setAttribute('role', 'bleeder');
				bleederMaxpandle.setAttribute('aria-valuemin', this.options.min);
				bleederMaxpandle.setAttribute('aria-valuemax', this.options.max);

				bleederTrack.appendChild(bleederTrackLow);
				bleederTrack.appendChild(bleederTrackSelection);
				bleederTrack.appendChild(bleederTrackHigh);

				/* Create highlight range elements */
				this.rangeHighlightElements = [];
				var rangeHighlightsOpts = this.options.rangeHighlights;
				if (Array.isArray(rangeHighlightsOpts) && rangeHighlightsOpts.length > 0) {
					for (var j = 0; j < rangeHighlightsOpts.length; j++) {
						var rangeHighlightElement = document.createElement("div");
						var customClassString = rangeHighlightsOpts[j].class || "";
						rangeHighlightElement.className = "bleeder-rangeHighlight bleeder-selection " + customClassString;
						this.rangeHighlightElements.push(rangeHighlightElement);
						bleederTrack.appendChild(rangeHighlightElement);
					}
				}

				/* Add aria-labelledby to pandle's */
				var isLabelledbyArray = Array.isArray(this.options.labelledby);
				if (isLabelledbyArray && this.options.labelledby[0]) {
					bleederMinpandle.setAttribute('aria-labelledby', this.options.labelledby[0]);
				}
				if (isLabelledbyArray && this.options.labelledby[1]) {
					bleederMaxpandle.setAttribute('aria-labelledby', this.options.labelledby[1]);
				}
				if (!isLabelledbyArray && this.options.labelledby) {
					bleederMinpandle.setAttribute('aria-labelledby', this.options.labelledby);
					bleederMaxpandle.setAttribute('aria-labelledby', this.options.labelledby);
				}

				/* Create picks */
				this.picks = [];
				if (Array.isArray(this.options.picks) && this.options.picks.length > 0) {
					this.picksContainer = document.createElement('div');
					this.picksContainer.className = 'bleeder-pick-container';

					for (i = 0; i < this.options.picks.length; i++) {
						var pick = document.createElement('div');
						pick.className = 'bleeder-pick';
						if (this.options.picks_tooltip) {
							var pickListenerReference = this._addpickListener();
							var enterCallback = pickListenerReference.addMouseEnter(this, pick, i);
							var leaveCallback = pickListenerReference.addMouseLeave(this, pick);

							this.picksCallbackMap[i] = {
								mouseEnter: enterCallback,
								mouseLeave: leaveCallback
							};
						}
						this.picks.push(pick);
						this.picksContainer.appendChild(pick);
					}

					bleederTrackSelection.className += " pick-bleeder-selection";
				}

				this.pickLabels = [];
				if (Array.isArray(this.options.picks_labels) && this.options.picks_labels.length > 0) {
					this.pickLabelContainer = document.createElement('div');
					this.pickLabelContainer.className = 'bleeder-pick-label-container';

					for (i = 0; i < this.options.picks_labels.length; i++) {
						var label = document.createElement('div');
						var nopickPositionsSpecified = this.options.picks_positions.length === 0;
						var pickLabelsIndex = this.options.reversed && nopickPositionsSpecified ? this.options.picks_labels.length - (i + 1) : i;
						label.className = 'bleeder-pick-label';
						label.innerHTML = this.options.picks_labels[pickLabelsIndex];

						this.pickLabels.push(label);
						this.pickLabelContainer.appendChild(label);
					}
				}

				var createAndAppendTooltipSubElements = function createAndAppendTooltipSubElements(tooltipElem) {
					var arrow = document.createElement("div");
					arrow.className = "arrow";

					var inner = document.createElement("div");
					inner.className = "tooltip-inner";

					tooltipElem.appendChild(arrow);
					tooltipElem.appendChild(inner);
				};

				/* Create tooltip elements */
				var bleederTooltip = document.createElement("div");
				bleederTooltip.className = "tooltip tooltip-main";
				bleederTooltip.setAttribute('role', 'presentation');
				createAndAppendTooltipSubElements(bleederTooltip);

				var bleederTooltipMin = document.createElement("div");
				bleederTooltipMin.className = "tooltip tooltip-min";
				bleederTooltipMin.setAttribute('role', 'presentation');
				createAndAppendTooltipSubElements(bleederTooltipMin);

				var bleederTooltipMax = document.createElement("div");
				bleederTooltipMax.className = "tooltip tooltip-max";
				bleederTooltipMax.setAttribute('role', 'presentation');
				createAndAppendTooltipSubElements(bleederTooltipMax);

				/* Append components to bleederElem */
				this.bleederElem.appendChild(bleederTrack);
				this.bleederElem.appendChild(bleederTooltip);
				this.bleederElem.appendChild(bleederTooltipMin);
				this.bleederElem.appendChild(bleederTooltipMax);

				if (this.pickLabelContainer) {
					this.bleederElem.appendChild(this.pickLabelContainer);
				}
				if (this.picksContainer) {
					this.bleederElem.appendChild(this.picksContainer);
				}

				this.bleederElem.appendChild(bleederMinpandle);
				this.bleederElem.appendChild(bleederMaxpandle);

				/* Append bleeder element to parent container, right before the original <input> element */
				parent.insertBefore(this.bleederElem, this.element);

				/* Hide original <input> element */
				this.element.style.display = "none";
			}
			/* If JQuery exists, cache JQ references */
			if ($) {
				this.$element = $(this.element);
				this.$bleederElem = $(this.bleederElem);
			}

			/*************************************************
   						Setup
   	**************************************************/
			this.eventToCallbackMap = {};
			this.bleederElem.id = this.options.id;

			this.touchCapable = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;

			this.touchX = 0;
			this.touchY = 0;

			this.tooltip = this.bleederElem.querySelector('.tooltip-main');
			this.tooltipInner = this.tooltip.querySelector('.tooltip-inner');

			this.tooltip_min = this.bleederElem.querySelector('.tooltip-min');
			this.tooltipInner_min = this.tooltip_min.querySelector('.tooltip-inner');

			this.tooltip_max = this.bleederElem.querySelector('.tooltip-max');
			this.tooltipInner_max = this.tooltip_max.querySelector('.tooltip-inner');

			if (bleederScale[this.options.scale]) {
				this.options.scale = bleederScale[this.options.scale];
			}

			if (updatebleeder === true) {
				// Reset classes
				this._removeClass(this.bleederElem, 'bleeder-horizontal');
				this._removeClass(this.bleederElem, 'bleeder-vertical');
				this._removeClass(this.bleederElem, 'bleeder-rtl');
				this._removeClass(this.tooltip, 'hide');
				this._removeClass(this.tooltip_min, 'hide');
				this._removeClass(this.tooltip_max, 'hide');

				// Undo existing inline styles for track
				["left", "right", "top", "width", "height"].forEach(function (prop) {
					this._removeProperty(this.trackLow, prop);
					this._removeProperty(this.trackSelection, prop);
					this._removeProperty(this.trackHigh, prop);
				}, this);

				// Undo inline styles on pandles
				[this.pandle1, this.pandle2].forEach(function (pandle) {
					this._removeProperty(pandle, 'left');
					this._removeProperty(pandle, 'right');
					this._removeProperty(pandle, 'top');
				}, this);

				// Undo inline styles and classes on tooltips
				[this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function (tooltip) {
					this._removeProperty(tooltip, 'bs-tooltip-left');
					this._removeProperty(tooltip, 'bs-tooltip-right');
					this._removeProperty(tooltip, 'bs-tooltip-top');

					this._removeClass(tooltip, 'bs-tooltip-right');
					this._removeClass(tooltip, 'bs-tooltip-left');
					this._removeClass(tooltip, 'bs-tooltip-top');
				}, this);
			}

			if (this.options.orientation === 'vertical') {
				this._addClass(this.bleederElem, 'bleeder-vertical');
				this.stylePos = 'top';
				this.mousePos = 'pageY';
				this.sizePos = 'offsetHeight';
			} else {
				this._addClass(this.bleederElem, 'bleeder-horizontal');
				this.bleederElem.style.width = origWidth;
				this.options.orientation = 'horizontal';
				if (this.options.rtl) {
					this.stylePos = 'right';
				} else {
					this.stylePos = 'left';
				}
				this.mousePos = 'clientX';
				this.sizePos = 'offsetWidth';
			}
			// specific rtl class
			if (this.options.rtl) {
				this._addClass(this.bleederElem, 'bleeder-rtl');
			}
			this._setTooltipPosition();
			/* In case picks are specified, overwrite the min and max bounds */
			if (Array.isArray(this.options.picks) && this.options.picks.length > 0) {
				if (!isMaxSet) {
					this.options.max = Math.max.apply(Math, this.options.picks);
				}
				if (!isMinSet) {
					this.options.min = Math.min.apply(Math, this.options.picks);
				}
			}

			if (Array.isArray(this.options.value)) {
				this.options.range = true;
				this._state.value = this.options.value;
			} else if (this.options.range) {
				// User wants a range, but value is not an array
				this._state.value = [this.options.value, this.options.max];
			} else {
				this._state.value = this.options.value;
			}

			this.trackLow = bleederTrackLow || this.trackLow;
			this.trackSelection = bleederTrackSelection || this.trackSelection;
			this.trackHigh = bleederTrackHigh || this.trackHigh;

			if (this.options.selection === 'none') {
				this._addClass(this.trackLow, 'hide');
				this._addClass(this.trackSelection, 'hide');
				this._addClass(this.trackHigh, 'hide');
			} else if (this.options.selection === 'after' || this.options.selection === 'before') {
				this._removeClass(this.trackLow, 'hide');
				this._removeClass(this.trackSelection, 'hide');
				this._removeClass(this.trackHigh, 'hide');
			}

			this.pandle1 = bleederMinpandle || this.pandle1;
			this.pandle2 = bleederMaxpandle || this.pandle2;

			if (updatebleeder === true) {
				// Reset classes
				this._removeClass(this.pandle1, 'round triangle');
				this._removeClass(this.pandle2, 'round triangle hide');

				for (i = 0; i < this.picks.length; i++) {
					this._removeClass(this.picks[i], 'round triangle hide');
				}
			}

			var availablepandleModifiers = ['round', 'triangle', 'custom'];
			var isValidpandleType = availablepandleModifiers.indexOf(this.options.pandle) !== -1;
			if (isValidpandleType) {
				this._addClass(this.pandle1, this.options.pandle);
				this._addClass(this.pandle2, this.options.pandle);

				for (i = 0; i < this.picks.length; i++) {
					this._addClass(this.picks[i], this.options.pandle);
				}
			}

			this._state.offset = this._offset(this.bleederElem);
			this._state.size = this.bleederElem[this.sizePos];
			this.setValue(this._state.value);

			/******************************************
   				Bind Event Listeners
   	******************************************/

			// Bind keyboard pandlers
			this.pandle1Keydown = this._keydown.bind(this, 0);
			this.pandle1.addEventListener("keydown", this.pandle1Keydown, false);

			this.pandle2Keydown = this._keydown.bind(this, 1);
			this.pandle2.addEventListener("keydown", this.pandle2Keydown, false);

			this.mousedown = this._mousedown.bind(this);
			this.touchstart = this._touchstart.bind(this);
			this.touchmove = this._touchmove.bind(this);

			if (this.touchCapable) {
				this.bleederElem.addEventListener("touchstart", this.touchstart, false);
				this.bleederElem.addEventListener("touchmove", this.touchmove, false);
			}

			this.bleederElem.addEventListener("mousedown", this.mousedown, false);

			// Bind window pandlers
			this.resize = this._resize.bind(this);
			window.addEventListener("resize", this.resize, false);

			// Bind tooltip-related pandlers
			if (this.options.tooltip === 'hide') {
				this._addClass(this.tooltip, 'hide');
				this._addClass(this.tooltip_min, 'hide');
				this._addClass(this.tooltip_max, 'hide');
			} else if (this.options.tooltip === 'always') {
				this._showTooltip();
				this._alwaysShowTooltip = true;
			} else {
				this.showTooltip = this._showTooltip.bind(this);
				this.hideTooltip = this._hideTooltip.bind(this);

				if (this.options.picks_tooltip) {
					var callbackpandle = this._addpickListener();
					//create pandle1 listeners and store references in map
					var mouseEnter = callbackpandle.addMouseEnter(this, this.pandle1);
					var mouseLeave = callbackpandle.addMouseLeave(this, this.pandle1);
					this.pandleCallbackMap.pandle1 = {
						mouseEnter: mouseEnter,
						mouseLeave: mouseLeave
					};
					//create pandle2 listeners and store references in map
					mouseEnter = callbackpandle.addMouseEnter(this, this.pandle2);
					mouseLeave = callbackpandle.addMouseLeave(this, this.pandle2);
					this.pandleCallbackMap.pandle2 = {
						mouseEnter: mouseEnter,
						mouseLeave: mouseLeave
					};
				} else {
					this.bleederElem.addEventListener("mouseenter", this.showTooltip, false);
					this.bleederElem.addEventListener("mouseleave", this.hideTooltip, false);

					if (this.touchCapable) {
						this.bleederElem.addEventListener("touchstart", this.showTooltip, false);
						this.bleederElem.addEventListener("touchmove", this.showTooltip, false);
						this.bleederElem.addEventListener("touchend", this.hideTooltip, false);
					}
				}

				this.pandle1.addEventListener("focus", this.showTooltip, false);
				this.pandle1.addEventListener("blur", this.hideTooltip, false);

				this.pandle2.addEventListener("focus", this.showTooltip, false);
				this.pandle2.addEventListener("blur", this.hideTooltip, false);

				if (this.touchCapable) {
					this.pandle1.addEventListener("touchstart", this.showTooltip, false);
					this.pandle1.addEventListener("touchmove", this.showTooltip, false);
					this.pandle1.addEventListener("touchend", this.hideTooltip, false);

					this.pandle2.addEventListener("touchstart", this.showTooltip, false);
					this.pandle2.addEventListener("touchmove", this.showTooltip, false);
					this.pandle2.addEventListener("touchend", this.hideTooltip, false);
				}
			}

			if (this.options.enabled) {
				this.enable();
			} else {
				this.disable();
			}
		}

		/*************************************************
  				INSTANCE PROPERTIES/METHODS
  	- Any methods bound to the prototype are considered
  part of the plugin's `public` interface
  	**************************************************/
		bleeder.prototype = {
			_init: function _init() {}, // NOTE: Must exist to support bridget

			constructor: bleeder,

			defaultOptions: {
				id: "",
				min: 0,
				max: 10,
				step: 1,
				precision: 0,
				orientation: 'horizontal',
				value: 5,
				range: false,
				selection: 'before',
				tooltip: 'show',
				tooltip_split: false,
				lock_to_picks: false,
				pandle: 'round',
				reversed: false,
				rtl: 'auto',
				enabled: true,
				formatter: function formatter(val) {
					if (Array.isArray(val)) {
						return val[0] + " : " + val[1];
					} else {
						return val;
					}
				},
				natural_arrow_keys: false,
				picks: [],
				picks_positions: [],
				picks_labels: [],
				picks_snap_bounds: 0,
				picks_tooltip: false,
				scale: 'linear',
				focus: false,
				tooltip_position: null,
				labelledby: null,
				rangeHighlights: []
			},

			getElement: function getElement() {
				return this.bleederElem;
			},

			getValue: function getValue() {
				if (this.options.range) {
					return this._state.value;
				} else {
					return this._state.value[0];
				}
			},

			setValue: function setValue(val, triggerSlideEvent, triggerChangeEvent) {
				if (!val) {
					val = 0;
				}
				var oldValue = this.getValue();
				this._state.value = this._validateInputValue(val);
				var applyPrecision = this._applyPrecision.bind(this);

				if (this.options.range) {
					this._state.value[0] = applyPrecision(this._state.value[0]);
					this._state.value[1] = applyPrecision(this._state.value[1]);

					if (this.picksAreValid && this.options.lock_to_picks) {
						this._state.value[0] = this.options.picks[this._getClosestpickIndex(this._state.value[0])];
						this._state.value[1] = this.options.picks[this._getClosestpickIndex(this._state.value[1])];
					}

					this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0]));
					this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]));
				} else {
					this._state.value = applyPrecision(this._state.value);

					if (this.picksAreValid && this.options.lock_to_picks) {
						this._state.value = this.options.picks[this._getClosestpickIndex(this._state.value)];
					}

					this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))];
					this._addClass(this.pandle2, 'hide');
					if (this.options.selection === 'after') {
						this._state.value[1] = this.options.max;
					} else {
						this._state.value[1] = this.options.min;
					}
				}

				// Determine which picks the pandle(s) are set at (if applicable)
				this._setpickIndex();

				if (this.options.max > this.options.min) {
					this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), this.options.step * 100 / (this.options.max - this.options.min)];
				} else {
					this._state.percentage = [0, 0, 100];
				}

				this._layout();
				var newValue = this.options.range ? this._state.value : this._state.value[0];

				this._setDataVal(newValue);
				if (triggerSlideEvent === true) {
					this._trigger('slide', newValue);
				}

				var hasChanged = false;
				if (Array.isArray(newValue)) {
					hasChanged = oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1];
				} else {
					hasChanged = oldValue !== newValue;
				}

				if (hasChanged && triggerChangeEvent === true) {
					this._trigger('change', {
						oldValue: oldValue,
						newValue: newValue
					});
				}

				return this;
			},

			destroy: function destroy() {
				// Remove event pandlers on bleeder elements
				this._removebleederEventpandlers();

				// Remove the bleeder from the DOM
				this.bleederElem.parentNode.removeChild(this.bleederElem);
				/* Show original <input> element */
				this.element.style.display = "";

				// Clear out custom event bindings
				this._cleanUpEventCallbacksMap();

				// Remove data values
				this.element.removeAttribute("data");

				// Remove JQuery pandlers/data
				if ($) {
					this._unbindJQueryEventpandlers();
					if (autoRegisterNamespace === NAMESPACE_MAIN) {
						this.$element.removeData(autoRegisterNamespace);
					}
					this.$element.removeData(NAMESPACE_ALTERNATE);
				}
			},

			disable: function disable() {
				this._state.enabled = false;
				this.pandle1.removeAttribute("tabindex");
				this.pandle2.removeAttribute("tabindex");
				this._addClass(this.bleederElem, 'bleeder-disabled');
				this._trigger('slideDisabled');

				return this;
			},

			enable: function enable() {
				this._state.enabled = true;
				this.pandle1.setAttribute("tabindex", 0);
				this.pandle2.setAttribute("tabindex", 0);
				this._removeClass(this.bleederElem, 'bleeder-disabled');
				this._trigger('slideEnabled');

				return this;
			},

			toggle: function toggle() {
				if (this._state.enabled) {
					this.disable();
				} else {
					this.enable();
				}
				return this;
			},

			isEnabled: function isEnabled() {
				return this._state.enabled;
			},

			on: function on(evt, callback) {
				this._bindNonQueryEventpandler(evt, callback);
				return this;
			},

			off: function off(evt, callback) {
				if ($) {
					this.$element.off(evt, callback);
					this.$bleederElem.off(evt, callback);
				} else {
					this._unbindNonQueryEventpandler(evt, callback);
				}
			},

			getAttribute: function getAttribute(attribute) {
				if (attribute) {
					return this.options[attribute];
				} else {
					return this.options;
				}
			},

			setAttribute: function setAttribute(attribute, value) {
				this.options[attribute] = value;
				return this;
			},

			refresh: function refresh(options) {
				var currentValue = this.getValue();
				this._removebleederEventpandlers();
				createNewbleeder.call(this, this.element, this.options);
				// Don't reset bleeder's value on refresh if `useCurrentValue` is true
				if (options && options.useCurrentValue === true) {
					this.setValue(currentValue);
				}
				if ($) {
					// Bind new instance of bleeder to the element
					if (autoRegisterNamespace === NAMESPACE_MAIN) {
						$.data(this.element, NAMESPACE_MAIN, this);
						$.data(this.element, NAMESPACE_ALTERNATE, this);
					} else {
						$.data(this.element, NAMESPACE_ALTERNATE, this);
					}
				}
				return this;
			},

			relayout: function relayout() {
				this._resize();
				return this;
			},

			/******************************+
   				HELPERS
   	- Any method that is not part of the public interface.
   - Place it underneath this comment block and write its signature like so:
   		_fnName : function() {...}
   	********************************/
			_removeTooltipListener: function _removeTooltipListener(event, pandler) {
				this.pandle1.removeEventListener(event, pandler, false);
				this.pandle2.removeEventListener(event, pandler, false);
			},
			_removebleederEventpandlers: function _removebleederEventpandlers() {
				// Remove keydown event listeners
				this.pandle1.removeEventListener("keydown", this.pandle1Keydown, false);
				this.pandle2.removeEventListener("keydown", this.pandle2Keydown, false);

				//remove the listeners from the picks and pandles if they had their own listeners
				if (this.options.picks_tooltip) {
					var picks = this.picksContainer.getElementsByClassName('bleeder-pick');
					for (var i = 0; i < picks.length; i++) {
						picks[i].removeEventListener('mouseenter', this.picksCallbackMap[i].mouseEnter, false);
						picks[i].removeEventListener('mouseleave', this.picksCallbackMap[i].mouseLeave, false);
					}
					if (this.pandleCallbackMap.pandle1 && this.pandleCallbackMap.pandle2) {
						this.pandle1.removeEventListener('mouseenter', this.pandleCallbackMap.pandle1.mouseEnter, false);
						this.pandle2.removeEventListener('mouseenter', this.pandleCallbackMap.pandle2.mouseEnter, false);
						this.pandle1.removeEventListener('mouseleave', this.pandleCallbackMap.pandle1.mouseLeave, false);
						this.pandle2.removeEventListener('mouseleave', this.pandleCallbackMap.pandle2.mouseLeave, false);
					}
				}

				this.pandleCallbackMap = null;
				this.picksCallbackMap = null;

				if (this.showTooltip) {
					this._removeTooltipListener("focus", this.showTooltip);
				}
				if (this.hideTooltip) {
					this._removeTooltipListener("blur", this.hideTooltip);
				}

				// Remove event listeners from bleederElem
				if (this.showTooltip) {
					this.bleederElem.removeEventListener("mouseenter", this.showTooltip, false);
				}
				if (this.hideTooltip) {
					this.bleederElem.removeEventListener("mouseleave", this.hideTooltip, false);
				}

				this.bleederElem.removeEventListener("mousedown", this.mousedown, false);

				if (this.touchCapable) {
					// Remove touch event listeners from pandles
					if (this.showTooltip) {
						this.pandle1.removeEventListener("touchstart", this.showTooltip, false);
						this.pandle1.removeEventListener("touchmove", this.showTooltip, false);
						this.pandle2.removeEventListener("touchstart", this.showTooltip, false);
						this.pandle2.removeEventListener("touchmove", this.showTooltip, false);
					}
					if (this.hideTooltip) {
						this.pandle1.removeEventListener("touchend", this.hideTooltip, false);
						this.pandle2.removeEventListener("touchend", this.hideTooltip, false);
					}

					// Remove event listeners from bleederElem
					if (this.showTooltip) {
						this.bleederElem.removeEventListener("touchstart", this.showTooltip, false);
						this.bleederElem.removeEventListener("touchmove", this.showTooltip, false);
					}
					if (this.hideTooltip) {
						this.bleederElem.removeEventListener("touchend", this.hideTooltip, false);
					}

					this.bleederElem.removeEventListener("touchstart", this.touchstart, false);
					this.bleederElem.removeEventListener("touchmove", this.touchmove, false);
				}

				// Remove window event listener
				window.removeEventListener("resize", this.resize, false);
			},
			_bindNonQueryEventpandler: function _bindNonQueryEventpandler(evt, callback) {
				if (this.eventToCallbackMap[evt] === undefined) {
					this.eventToCallbackMap[evt] = [];
				}
				this.eventToCallbackMap[evt].push(callback);
			},
			_unbindNonQueryEventpandler: function _unbindNonQueryEventpandler(evt, callback) {
				var callbacks = this.eventToCallbackMap[evt];
				if (callbacks !== undefined) {
					for (var i = 0; i < callbacks.length; i++) {
						if (callbacks[i] === callback) {
							callbacks.splice(i, 1);
							break;
						}
					}
				}
			},
			_cleanUpEventCallbacksMap: function _cleanUpEventCallbacksMap() {
				var eventNames = Object.keys(this.eventToCallbackMap);
				for (var i = 0; i < eventNames.length; i++) {
					var eventName = eventNames[i];
					delete this.eventToCallbackMap[eventName];
				}
			},
			_showTooltip: function _showTooltip() {
				if (this.options.tooltip_split === false) {
					this._addClass(this.tooltip, 'show');
					this.tooltip_min.style.display = 'none';
					this.tooltip_max.style.display = 'none';
				} else {
					this._addClass(this.tooltip_min, 'show');
					this._addClass(this.tooltip_max, 'show');
					this.tooltip.style.display = 'none';
				}
				this._state.over = true;
			},
			_hideTooltip: function _hideTooltip() {
				if (this._state.inDrag === false && this._alwaysShowTooltip !== true) {
					this._removeClass(this.tooltip, 'show');
					this._removeClass(this.tooltip_min, 'show');
					this._removeClass(this.tooltip_max, 'show');
				}
				this._state.over = false;
			},
			_setToolTipOnMouseOver: function _setToolTipOnMouseOver(tempState) {
				var self = this;
				var formattedTooltipVal = this.options.formatter(!tempState ? this._state.value[0] : tempState.value[0]);
				var positionPercentages = !tempState ? getPositionPercentages(this._state, this.options.reversed) : getPositionPercentages(tempState, this.options.reversed);
				this._setText(this.tooltipInner, formattedTooltipVal);

				this.tooltip.style[this.stylePos] = positionPercentages[0] + "%";

				function getPositionPercentages(state, reversed) {
					if (reversed) {
						return [100 - state.percentage[0], self.options.range ? 100 - state.percentage[1] : state.percentage[1]];
					}
					return [state.percentage[0], state.percentage[1]];
				}
			},
			_copyState: function _copyState() {
				return {
					value: [this._state.value[0], this._state.value[1]],
					enabled: this._state.enabled,
					offset: this._state.offset,
					size: this._state.size,
					percentage: [this._state.percentage[0], this._state.percentage[1], this._state.percentage[2]],
					inDrag: this._state.inDrag,
					over: this._state.over,
					// deleted or null'd keys
					dragged: this._state.dragged,
					keyCtrl: this._state.keyCtrl
				};
			},
			_addpickListener: function _addpickListener() {
				return {
					addMouseEnter: function addMouseEnter(reference, element, index) {
						var enter = function enter() {
							var tempState = reference._copyState();
							// Which pandle is being hovered over?
							var val = element === reference.pandle1 ? tempState.value[0] : tempState.value[1];
							var per = void 0;

							// Setup value and percentage for pick's 'mouseenter'
							if (index !== undefined) {
								val = reference.options.picks[index];
								per = reference.options.picks_positions.length > 0 && reference.options.picks_positions[index] || reference._toPercentage(reference.options.picks[index]);
							} else {
								per = reference._toPercentage(val);
							}

							tempState.value[0] = val;
							tempState.percentage[0] = per;
							reference._setToolTipOnMouseOver(tempState);
							reference._showTooltip();
						};
						element.addEventListener("mouseenter", enter, false);
						return enter;
					},
					addMouseLeave: function addMouseLeave(reference, element) {
						var leave = function leave() {
							reference._hideTooltip();
						};
						element.addEventListener("mouseleave", leave, false);
						return leave;
					}
				};
			},
			_layout: function _layout() {
				var positionPercentages;
				var formattedValue;

				if (this.options.reversed) {
					positionPercentages = [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]];
				} else {
					positionPercentages = [this._state.percentage[0], this._state.percentage[1]];
				}

				this.pandle1.style[this.stylePos] = positionPercentages[0] + "%";
				this.pandle1.setAttribute('aria-valuenow', this._state.value[0]);
				formattedValue = this.options.formatter(this._state.value[0]);
				if (isNaN(formattedValue)) {
					this.pandle1.setAttribute('aria-valuetext', formattedValue);
				} else {
					this.pandle1.removeAttribute('aria-valuetext');
				}

				this.pandle2.style[this.stylePos] = positionPercentages[1] + "%";
				this.pandle2.setAttribute('aria-valuenow', this._state.value[1]);
				formattedValue = this.options.formatter(this._state.value[1]);
				if (isNaN(formattedValue)) {
					this.pandle2.setAttribute('aria-valuetext', formattedValue);
				} else {
					this.pandle2.removeAttribute('aria-valuetext');
				}

				/* Position highlight range elements */
				if (this.rangeHighlightElements.length > 0 && Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0) {
					for (var _i = 0; _i < this.options.rangeHighlights.length; _i++) {
						var startPercent = this._toPercentage(this.options.rangeHighlights[_i].start);
						var endPercent = this._toPercentage(this.options.rangeHighlights[_i].end);

						if (this.options.reversed) {
							var sp = 100 - endPercent;
							endPercent = 100 - startPercent;
							startPercent = sp;
						}

						var currentRange = this._createHighlightRange(startPercent, endPercent);

						if (currentRange) {
							if (this.options.orientation === 'vertical') {
								this.rangeHighlightElements[_i].style.top = currentRange.start + "%";
								this.rangeHighlightElements[_i].style.height = currentRange.size + "%";
							} else {
								if (this.options.rtl) {
									this.rangeHighlightElements[_i].style.right = currentRange.start + "%";
								} else {
									this.rangeHighlightElements[_i].style.left = currentRange.start + "%";
								}
								this.rangeHighlightElements[_i].style.width = currentRange.size + "%";
							}
						} else {
							this.rangeHighlightElements[_i].style.display = "none";
						}
					}
				}

				/* Position picks and labels */
				if (Array.isArray(this.options.picks) && this.options.picks.length > 0) {

					var styleSize = this.options.orientation === 'vertical' ? 'height' : 'width';
					var styleMargin;
					if (this.options.orientation === 'vertical') {
						styleMargin = 'marginTop';
					} else {
						if (this.options.rtl) {
							styleMargin = 'marginRight';
						} else {
							styleMargin = 'marginLeft';
						}
					}
					var labelSize = this._state.size / (this.options.picks.length - 1);

					if (this.pickLabelContainer) {
						var extraMargin = 0;
						if (this.options.picks_positions.length === 0) {
							if (this.options.orientation !== 'vertical') {
								this.pickLabelContainer.style[styleMargin] = -labelSize / 2 + "px";
							}

							extraMargin = this.pickLabelContainer.offsetHeight;
						} else {
							/* Chidren are position absolute, calculate height by finding the max offsetHeight of a child */
							for (i = 0; i < this.pickLabelContainer.childNodes.length; i++) {
								if (this.pickLabelContainer.childNodes[i].offsetHeight > extraMargin) {
									extraMargin = this.pickLabelContainer.childNodes[i].offsetHeight;
								}
							}
						}
						if (this.options.orientation === 'horizontal') {
							this.bleederElem.style.marginBottom = extraMargin + "px";
						}
					}
					for (var i = 0; i < this.options.picks.length; i++) {

						var percentage = this.options.picks_positions[i] || this._toPercentage(this.options.picks[i]);

						if (this.options.reversed) {
							percentage = 100 - percentage;
						}

						this.picks[i].style[this.stylePos] = percentage + "%";

						/* Set class labels to denote whether picks are in the selection */
						this._removeClass(this.picks[i], 'in-selection');
						if (!this.options.range) {
							if (this.options.selection === 'after' && percentage >= positionPercentages[0]) {
								this._addClass(this.picks[i], 'in-selection');
							} else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
								this._addClass(this.picks[i], 'in-selection');
							}
						} else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
							this._addClass(this.picks[i], 'in-selection');
						}

						if (this.pickLabels[i]) {
							this.pickLabels[i].style[styleSize] = labelSize + "px";

							if (this.options.orientation !== 'vertical' && this.options.picks_positions[i] !== undefined) {
								this.pickLabels[i].style.position = 'absolute';
								this.pickLabels[i].style[this.stylePos] = percentage + "%";
								this.pickLabels[i].style[styleMargin] = -labelSize / 2 + 'px';
							} else if (this.options.orientation === 'vertical') {
								if (this.options.rtl) {
									this.pickLabels[i].style['marginRight'] = this.bleederElem.offsetWidth + "px";
								} else {
									this.pickLabels[i].style['marginLeft'] = this.bleederElem.offsetWidth + "px";
								}
								this.pickLabelContainer.style[styleMargin] = this.bleederElem.offsetWidth / 2 * -1 + 'px';
							}

							/* Set class labels to indicate pick labels are in the selection or selected */
							this._removeClass(this.pickLabels[i], 'label-in-selection label-is-selection');
							if (!this.options.range) {
								if (this.options.selection === 'after' && percentage >= positionPercentages[0]) {
									this._addClass(this.pickLabels[i], 'label-in-selection');
								} else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
									this._addClass(this.pickLabels[i], 'label-in-selection');
								}
								if (percentage === positionPercentages[0]) {
									this._addClass(this.pickLabels[i], 'label-is-selection');
								}
							} else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
								this._addClass(this.pickLabels[i], 'label-in-selection');
								if (percentage === positionPercentages[0] || positionPercentages[1]) {
									this._addClass(this.pickLabels[i], 'label-is-selection');
								}
							}
						}
					}
				}

				var formattedTooltipVal;

				if (this.options.range) {
					formattedTooltipVal = this.options.formatter(this._state.value);
					this._setText(this.tooltipInner, formattedTooltipVal);
					this.tooltip.style[this.stylePos] = (positionPercentages[1] + positionPercentages[0]) / 2 + "%";

					var innerTooltipMinText = this.options.formatter(this._state.value[0]);
					this._setText(this.tooltipInner_min, innerTooltipMinText);

					var innerTooltipMaxText = this.options.formatter(this._state.value[1]);
					this._setText(this.tooltipInner_max, innerTooltipMaxText);

					this.tooltip_min.style[this.stylePos] = positionPercentages[0] + "%";

					this.tooltip_max.style[this.stylePos] = positionPercentages[1] + "%";
				} else {
					formattedTooltipVal = this.options.formatter(this._state.value[0]);
					this._setText(this.tooltipInner, formattedTooltipVal);

					this.tooltip.style[this.stylePos] = positionPercentages[0] + "%";
				}

				if (this.options.orientation === 'vertical') {
					this.trackLow.style.top = '0';
					this.trackLow.style.height = Math.min(positionPercentages[0], positionPercentages[1]) + '%';

					this.trackSelection.style.top = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
					this.trackSelection.style.height = Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

					this.trackHigh.style.bottom = '0';
					this.trackHigh.style.height = 100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';
				} else {
					if (this.stylePos === 'right') {
						this.trackLow.style.right = '0';
					} else {
						this.trackLow.style.left = '0';
					}
					this.trackLow.style.width = Math.min(positionPercentages[0], positionPercentages[1]) + '%';

					if (this.stylePos === 'right') {
						this.trackSelection.style.right = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
					} else {
						this.trackSelection.style.left = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
					}
					this.trackSelection.style.width = Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

					if (this.stylePos === 'right') {
						this.trackHigh.style.left = '0';
					} else {
						this.trackHigh.style.right = '0';
					}
					this.trackHigh.style.width = 100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

					var offset_min = this.tooltip_min.getBoundingClientRect();
					var offset_max = this.tooltip_max.getBoundingClientRect();

					if (this.options.tooltip_position === 'bottom') {
						if (offset_min.right > offset_max.left) {
							this._removeClass(this.tooltip_max, 'bs-tooltip-bottom');
							this._addClass(this.tooltip_max, 'bs-tooltip-top');
							this.tooltip_max.style.top = '';
							this.tooltip_max.style.bottom = 22 + 'px';
						} else {
							this._removeClass(this.tooltip_max, 'bs-tooltip-top');
							this._addClass(this.tooltip_max, 'bs-tooltip-bottom');
							this.tooltip_max.style.top = this.tooltip_min.style.top;
							this.tooltip_max.style.bottom = '';
						}
					} else {
						if (offset_min.right > offset_max.left) {
							this._removeClass(this.tooltip_max, 'bs-tooltip-top');
							this._addClass(this.tooltip_max, 'bs-tooltip-bottom');
							this.tooltip_max.style.top = 18 + 'px';
						} else {
							this._removeClass(this.tooltip_max, 'bs-tooltip-bottom');
							this._addClass(this.tooltip_max, 'bs-tooltip-top');
							this.tooltip_max.style.top = this.tooltip_min.style.top;
						}
					}
				}
			},
			_createHighlightRange: function _createHighlightRange(start, end) {
				if (this._isHighlightRange(start, end)) {
					if (start > end) {
						return { 'start': end, 'size': start - end };
					}
					return { 'start': start, 'size': end - start };
				}
				return null;
			},
			_isHighlightRange: function _isHighlightRange(start, end) {
				if (0 <= start && start <= 100 && 0 <= end && end <= 100) {
					return true;
				} else {
					return false;
				}
			},
			_resize: function _resize(ev) {
				/*jshint unused:false*/
				this._state.offset = this._offset(this.bleederElem);
				this._state.size = this.bleederElem[this.sizePos];
				this._layout();
			},
			_removeProperty: function _removeProperty(element, prop) {
				if (element.style.removeProperty) {
					element.style.removeProperty(prop);
				} else {
					element.style.removeAttribute(prop);
				}
			},
			_mousedown: function _mousedown(ev) {
				if (!this._state.enabled) {
					return false;
				}

				if (ev.preventDefault) {
					ev.preventDefault();
				}

				this._state.offset = this._offset(this.bleederElem);
				this._state.size = this.bleederElem[this.sizePos];

				var percentage = this._getPercentage(ev);

				if (this.options.range) {
					var diff1 = Math.abs(this._state.percentage[0] - percentage);
					var diff2 = Math.abs(this._state.percentage[1] - percentage);
					this._state.dragged = diff1 < diff2 ? 0 : 1;
					this._adjustPercentageForRangebleeders(percentage);
				} else {
					this._state.dragged = 0;
				}

				this._state.percentage[this._state.dragged] = percentage;

				if (this.touchCapable) {
					document.removeEventListener("touchmove", this.mousemove, false);
					document.removeEventListener("touchend", this.mouseup, false);
				}

				if (this.mousemove) {
					document.removeEventListener("mousemove", this.mousemove, false);
				}
				if (this.mouseup) {
					document.removeEventListener("mouseup", this.mouseup, false);
				}

				this.mousemove = this._mousemove.bind(this);
				this.mouseup = this._mouseup.bind(this);

				if (this.touchCapable) {
					// Touch: Bind touch events:
					document.addEventListener("touchmove", this.mousemove, false);
					document.addEventListener("touchend", this.mouseup, false);
				}
				// Bind mouse events:
				document.addEventListener("mousemove", this.mousemove, false);
				document.addEventListener("mouseup", this.mouseup, false);

				this._state.inDrag = true;
				var newValue = this._calculateValue();

				this._trigger('slideStart', newValue);

				this.setValue(newValue, false, true);

				ev.returnValue = false;

				if (this.options.focus) {
					this._triggerFocusOnpandle(this._state.dragged);
				}

				return true;
			},
			_touchstart: function _touchstart(ev) {
				this._mousedown(ev);
			},
			_triggerFocusOnpandle: function _triggerFocusOnpandle(pandleIdx) {
				if (pandleIdx === 0) {
					this.pandle1.focus();
				}
				if (pandleIdx === 1) {
					this.pandle2.focus();
				}
			},
			_keydown: function _keydown(pandleIdx, ev) {
				if (!this._state.enabled) {
					return false;
				}

				var dir;
				switch (ev.keyCode) {
					case 37: // left
					case 40:
						// down
						dir = -1;
						break;
					case 39: // right
					case 38:
						// up
						dir = 1;
						break;
				}
				if (!dir) {
					return;
				}

				// use natural arrow keys instead of from min to max
				if (this.options.natural_arrow_keys) {
					var isHorizontal = this.options.orientation === 'horizontal';
					var isVertical = this.options.orientation === 'vertical';
					var isRTL = this.options.rtl;
					var isReversed = this.options.reversed;

					if (isHorizontal) {
						if (isRTL) {
							if (!isReversed) {
								dir = -dir;
							}
						} else {
							if (isReversed) {
								dir = -dir;
							}
						}
					} else if (isVertical) {
						if (!isReversed) {
							dir = -dir;
						}
					}
				}

				var val;
				if (this.picksAreValid && this.options.lock_to_picks) {
					var index = void 0;
					// Find pick index that pandle 1/2 is currently on
					index = this.options.picks.indexOf(this._state.value[pandleIdx]);
					if (index === -1) {
						// Set default to first pick
						index = 0;
						window.console.warn('(lock_to_picks) _keydown: index should not be -1');
					}
					index += dir;
					index = Math.max(0, Math.min(this.options.picks.length - 1, index));
					val = this.options.picks[index];
				} else {
					val = this._state.value[pandleIdx] + dir * this.options.step;
				}
				var percentage = this._toPercentage(val);
				this._state.keyCtrl = pandleIdx;
				if (this.options.range) {
					this._adjustPercentageForRangebleeders(percentage);
					var val1 = !this._state.keyCtrl ? val : this._state.value[0];
					var val2 = this._state.keyCtrl ? val : this._state.value[1];
					// Restrict values within limits
					val = [Math.max(this.options.min, Math.min(this.options.max, val1)), Math.max(this.options.min, Math.min(this.options.max, val2))];
				} else {
					val = Math.max(this.options.min, Math.min(this.options.max, val));
				}

				this._trigger('slideStart', val);

				this.setValue(val, true, true);

				this._trigger('slideStop', val);

				this._pauseEvent(ev);
				delete this._state.keyCtrl;

				return false;
			},
			_pauseEvent: function _pauseEvent(ev) {
				if (ev.stopPropagation) {
					ev.stopPropagation();
				}
				if (ev.preventDefault) {
					ev.preventDefault();
				}
				ev.cancelBubble = true;
				ev.returnValue = false;
			},
			_mousemove: function _mousemove(ev) {
				if (!this._state.enabled) {
					return false;
				}

				var percentage = this._getPercentage(ev);
				this._adjustPercentageForRangebleeders(percentage);
				this._state.percentage[this._state.dragged] = percentage;

				var val = this._calculateValue(true);
				this.setValue(val, true, true);

				return false;
			},
			_touchmove: function _touchmove(ev) {
				if (ev.changedTouches === undefined) {
					return;
				}

				// Prevent page from scrolling and only drag the bleeder
				if (ev.preventDefault) {
					ev.preventDefault();
				}
			},
			_adjustPercentageForRangebleeders: function _adjustPercentageForRangebleeders(percentage) {
				if (this.options.range) {
					var precision = this._getNumDigitsAfterDecimalPlace(percentage);
					precision = precision ? precision - 1 : 0;
					var percentageWithAdjustedPrecision = this._applyToFixedAndParseFloat(percentage, precision);
					if (this._state.dragged === 0 && this._applyToFixedAndParseFloat(this._state.percentage[1], precision) < percentageWithAdjustedPrecision) {
						this._state.percentage[0] = this._state.percentage[1];
						this._state.dragged = 1;
					} else if (this._state.dragged === 1 && this._applyToFixedAndParseFloat(this._state.percentage[0], precision) > percentageWithAdjustedPrecision) {
						this._state.percentage[1] = this._state.percentage[0];
						this._state.dragged = 0;
					} else if (this._state.keyCtrl === 0 && this._toPercentage(this._state.value[1]) < percentage) {
						this._state.percentage[0] = this._state.percentage[1];
						this._state.keyCtrl = 1;
						this.pandle2.focus();
					} else if (this._state.keyCtrl === 1 && this._toPercentage(this._state.value[0]) > percentage) {
						this._state.percentage[1] = this._state.percentage[0];
						this._state.keyCtrl = 0;
						this.pandle1.focus();
					}
				}
			},
			_mouseup: function _mouseup(ev) {
				if (!this._state.enabled) {
					return false;
				}

				var percentage = this._getPercentage(ev);
				this._adjustPercentageForRangebleeders(percentage);
				this._state.percentage[this._state.dragged] = percentage;

				if (this.touchCapable) {
					// Touch: Unbind touch event pandlers:
					document.removeEventListener("touchmove", this.mousemove, false);
					document.removeEventListener("touchend", this.mouseup, false);
				}
				// Unbind mouse event pandlers:
				document.removeEventListener("mousemove", this.mousemove, false);
				document.removeEventListener("mouseup", this.mouseup, false);

				this._state.inDrag = false;
				if (this._state.over === false) {
					this._hideTooltip();
				}
				var val = this._calculateValue(true);

				this.setValue(val, false, true);
				this._trigger('slideStop', val);

				// No longer need 'dragged' after mouse up
				this._state.dragged = null;

				return false;
			},
			_setValues: function _setValues(index, val) {
				var comp = 0 === index ? 0 : 100;
				if (this._state.percentage[index] !== comp) {
					val.data[index] = this._toValue(this._state.percentage[index]);
					val.data[index] = this._applyPrecision(val.data[index]);
				}
			},
			_calculateValue: function _calculateValue(snapToClosestpick) {
				var val = {};
				if (this.options.range) {
					val.data = [this.options.min, this.options.max];
					this._setValues(0, val);
					this._setValues(1, val);
					if (snapToClosestpick) {
						val.data[0] = this._snapToClosestpick(val.data[0]);
						val.data[1] = this._snapToClosestpick(val.data[1]);
					}
				} else {
					val.data = this._toValue(this._state.percentage[0]);
					val.data = parseFloat(val.data);
					val.data = this._applyPrecision(val.data);
					if (snapToClosestpick) {
						val.data = this._snapToClosestpick(val.data);
					}
				}

				return val.data;
			},
			_snapToClosestpick: function _snapToClosestpick(val) {
				var min = [val, Infinity];
				for (var i = 0; i < this.options.picks.length; i++) {
					var diff = Math.abs(this.options.picks[i] - val);
					if (diff <= min[1]) {
						min = [this.options.picks[i], diff];
					}
				}
				if (min[1] <= this.options.picks_snap_bounds) {
					return min[0];
				}
				return val;
			},

			_applyPrecision: function _applyPrecision(val) {
				var precision = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
				return this._applyToFixedAndParseFloat(val, precision);
			},
			_getNumDigitsAfterDecimalPlace: function _getNumDigitsAfterDecimalPlace(num) {
				var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
				if (!match) {
					return 0;
				}
				return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
			},
			_applyToFixedAndParseFloat: function _applyToFixedAndParseFloat(num, toFixedInput) {
				var truncatedNum = num.toFixed(toFixedInput);
				return parseFloat(truncatedNum);
			},
			/*
   	Credits to Mike Samuel for the following method!
   	Source: http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
   */
			_getPercentage: function _getPercentage(ev) {
				if (this.touchCapable && (ev.type === 'touchstart' || ev.type === 'touchmove' || ev.type === 'touchend')) {
					ev = ev.changedTouches[0];
				}

				var eventPosition = ev[this.mousePos];
				var bleederOffset = this._state.offset[this.stylePos];
				var distanceToSlide = eventPosition - bleederOffset;
				if (this.stylePos === 'right') {
					distanceToSlide = -distanceToSlide;
				}
				// Calculate what percent of the length the bleeder pandle has slid
				var percentage = distanceToSlide / this._state.size * 100;
				percentage = Math.round(percentage / this._state.percentage[2]) * this._state.percentage[2];
				if (this.options.reversed) {
					percentage = 100 - percentage;
				}

				// Make sure the percent is within the bounds of the bleeder.
				// 0% corresponds to the 'min' value of the slide
				// 100% corresponds to the 'max' value of the slide
				return Math.max(0, Math.min(100, percentage));
			},
			_validateInputValue: function _validateInputValue(val) {
				if (!isNaN(+val)) {
					return +val;
				} else if (Array.isArray(val)) {
					this._validateArray(val);
					return val;
				} else {
					throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(val));
				}
			},
			_validateArray: function _validateArray(val) {
				for (var i = 0; i < val.length; i++) {
					var input = val[i];
					if (typeof input !== 'number') {
						throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(input));
					}
				}
			},
			_setDataVal: function _setDataVal(val) {
				this.element.setAttribute('data-value', val);
				this.element.setAttribute('value', val);
				this.element.value = val;
			},
			_trigger: function _trigger(evt, val) {
				val = val || val === 0 ? val : undefined;

				var callbackFnArray = this.eventToCallbackMap[evt];
				if (callbackFnArray && callbackFnArray.length) {
					for (var i = 0; i < callbackFnArray.length; i++) {
						var callbackFn = callbackFnArray[i];
						callbackFn(val);
					}
				}

				/* If JQuery exists, trigger JQuery events */
				if ($) {
					this._triggerJQueryEvent(evt, val);
				}
			},
			_triggerJQueryEvent: function _triggerJQueryEvent(evt, val) {
				var eventData = {
					type: evt,
					value: val
				};
				this.$element.trigger(eventData);
				this.$bleederElem.trigger(eventData);
			},
			_unbindJQueryEventpandlers: function _unbindJQueryEventpandlers() {
				this.$element.off();
				this.$bleederElem.off();
			},
			_setText: function _setText(element, text) {
				if (typeof element.textContent !== "undefined") {
					element.textContent = text;
				} else if (typeof element.innerText !== "undefined") {
					element.innerText = text;
				}
			},
			_removeClass: function _removeClass(element, classString) {
				var classes = classString.split(" ");
				var newClasses = element.className;

				for (var i = 0; i < classes.length; i++) {
					var classTag = classes[i];
					var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
					newClasses = newClasses.replace(regex, " ");
				}

				element.className = newClasses.trim();
			},
			_addClass: function _addClass(element, classString) {
				var classes = classString.split(" ");
				var newClasses = element.className;

				for (var i = 0; i < classes.length; i++) {
					var classTag = classes[i];
					var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
					var ifClassExists = regex.test(newClasses);

					if (!ifClassExists) {
						newClasses += " " + classTag;
					}
				}

				element.className = newClasses.trim();
			},
			_offsetLeft: function _offsetLeft(obj) {
				return obj.getBoundingClientRect().left;
			},
			_offsetRight: function _offsetRight(obj) {
				return obj.getBoundingClientRect().right;
			},
			_offsetTop: function _offsetTop(obj) {
				var offsetTop = obj.offsetTop;
				while ((obj = obj.offsetParent) && !isNaN(obj.offsetTop)) {
					offsetTop += obj.offsetTop;
					if (obj.tagName !== 'BODY') {
						offsetTop -= obj.scrollTop;
					}
				}
				return offsetTop;
			},
			_offset: function _offset(obj) {
				return {
					left: this._offsetLeft(obj),
					right: this._offsetRight(obj),
					top: this._offsetTop(obj)
				};
			},
			_css: function _css(elementRef, styleName, value) {
				if ($) {
					$.style(elementRef, styleName, value);
				} else {
					var style = styleName.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (all, letter) {
						return letter.toUpperCase();
					});
					elementRef.style[style] = value;
				}
			},
			_toValue: function _toValue(percentage) {
				return this.options.scale.toValue.apply(this, [percentage]);
			},
			_toPercentage: function _toPercentage(value) {
				return this.options.scale.toPercentage.apply(this, [value]);
			},
			_setTooltipPosition: function _setTooltipPosition() {
				var tooltips = [this.tooltip, this.tooltip_min, this.tooltip_max];
				if (this.options.orientation === 'vertical') {
					var tooltipPos;
					if (this.options.tooltip_position) {
						tooltipPos = this.options.tooltip_position;
					} else {
						if (this.options.rtl) {
							tooltipPos = 'left';
						} else {
							tooltipPos = 'right';
						}
					}
					var oppositeSide = tooltipPos === 'left' ? 'right' : 'left';
					tooltips.forEach(function (tooltip) {
						this._addClass(tooltip, 'bs-tooltip-' + tooltipPos);
						tooltip.style[oppositeSide] = '100%';
					}.bind(this));
				} else if (this.options.tooltip_position === 'bottom') {
					tooltips.forEach(function (tooltip) {
						this._addClass(tooltip, 'bs-tooltip-bottom');
						tooltip.style.top = 22 + 'px';
					}.bind(this));
				} else {
					tooltips.forEach(function (tooltip) {
						this._addClass(tooltip, 'bs-tooltip-top');
						tooltip.style.top = -this.tooltip.outerHeight - 14 + 'px';
					}.bind(this));
				}
			},
			_getClosestpickIndex: function _getClosestpickIndex(val) {
				var difference = Math.abs(val - this.options.picks[0]);
				var index = 0;
				for (var i = 0; i < this.options.picks.length; ++i) {
					var d = Math.abs(val - this.options.picks[i]);
					if (d < difference) {
						difference = d;
						index = i;
					}
				}
				return index;
			},
			/**
    * Attempts to find the index in `picks[]` the bleeder values are set at.
    * The indexes can be -1 to indicate the bleeder value is not set at a value in `picks[]`.
    */
			_setpickIndex: function _setpickIndex() {
				if (this.picksAreValid) {
					this._state.pickIndex = [this.options.picks.indexOf(this._state.value[0]), this.options.picks.indexOf(this._state.value[1])];
				}
			}
		};

		/*********************************
  		Attach to global namespace
  	*********************************/
		if ($ && $.fn) {
			if (!$.fn.bleeder) {
				$.bridget(NAMESPACE_MAIN, bleeder);
				autoRegisterNamespace = NAMESPACE_MAIN;
			} else {
				if (windowIsDefinedNew) {
					window.console.warn("bootstrap-bleeder.js - WARNING: $.fn.bleeder namespace is already bound. Use the $.fn.bootstrapbleeder namespace instead.");
				}
				autoRegisterNamespace = NAMESPACE_ALTERNATE;
			}
			$.bridget(NAMESPACE_ALTERNATE, bleeder);

			// Auto-Register data-provide="bleeder" Elements
			$(function () {
				$("input[data-provide=bleeder]")[autoRegisterNamespace]();
			});
		}
	})($);

	return bleeder;
});
