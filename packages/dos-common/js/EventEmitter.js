/**
 * @namespace Core
 *
 * A very basic event emitter that is bound to a single event, "change".
 */
function EventEmitter() {
  let listeners = [];
  let silenced = false;

  return {
    /**
     * Register a "change" callback.
     *
     * @param {Function} onChange
     */
    addChangeListener: function(onChange) {
      listeners.push(onChange);
    },

    /**
     * Remove a previously registered "change" callback.
     *
     * @param  {Function} onChange
     *         The same function you passed to [#addChangeListener]() - be
     *         careful of context bindings!
     */
    removeChangeListener: function(onChange) {
      var index = listeners.indexOf(onChange);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    },

    /**
     * Primary API. Emit a "change" event signalling to all listeners that
     * something has changed and they should react to it.
     */
    emitChange: function() {
      if (!silenced) {
        listeners.forEach(function(onChange) { onChange(); });
      }
    },

    /**
     * Clear all registered callbacks.
     */
    clear: function() {
      listeners = [];
    },

    inSilence(callback) {
      if (silenced) {
        return callback();
      }

      silenced = true;
      callback();
      silenced = false;
    }
  };
}

module.exports = EventEmitter;
