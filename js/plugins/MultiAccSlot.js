/*:
 * @target MZ
 * @plugindesc Allow more than 1 slot per equip type.
 * @help Blank equip type names count as previous non-blank equip type.
 * E.g. "Weapon", "Shield", "Ring", "", "Amulet" - defines 2 ring slots.
 *
 * Free to use and/or modify for any project, no credit required.
 */
// M06) Blank equip type names count as previous non-blank equip type.
// void (() => {
(function() {
'use strict';

    // E.g. "Weapon", "Shield", "Ring", "", "Amulet" - defines 2 ring slots.

    /** Array of root values for each equip type ID. */
    const types = [];

    /** Initialises {@linkcode types}. */
    const initDupeTypes = function() {
        const E = $dataSystem.equipTypes;
        const L = E.length;
        let root = types[0] = 1;
        for (let n = 1; ++n < L;)
            types[n - 1] = E[n] ? root = n : root;
    };

    /**
     * Maps given equip type ID to its root type ID.
     * @param {number} eTypeId input equip type ID
     * @returns {number} "real" equip type ID.
     */
    const dupeSlot = function(eTypeId) {
        return types[eTypeId - 1];
    };

    // Initialise dupe types on game boot.
    void (alias => {
        Scene_Boot.prototype.start = function() {
            initDupeTypes();
            alias.apply(this, arguments);
        };
    })(Scene_Boot.prototype.start);

    // Map equip slots to their root type ID as appropriate.
    void (alias => {
        Game_Actor.prototype.equipSlots = function() {
            return alias.apply(this, arguments).map(n => dupeSlot(n));
        };
    })(Game_Actor.prototype.equipSlots);

})();