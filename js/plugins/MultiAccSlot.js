/*:
 * @target MZ
 * @plugindesc Allow more than 1 slot per equip type.
 * @help Blank equip type names count as previous non-blank equip type.
 * E.g. "Weapon", "Shield", "Ring", "", "Amulet" - defines 2 ring slots.
 *
 * Free to use and/or modify for any project, no credit required.
 */
// M06) Blank equip type names count as previous non-blank equip type.
void (() => {
'use strict';

    // E.g. "Weapon", "Shield", "Ring", "", "Amulet" - defines 2 ring slots.

    /**
     * Tracks duplicate equip types.
     * @type {Map<number,number[]>}
     */
    const dupeTypes = new Map();

    /** Initialises `dupeTypes`. */
    const initDupeTypes = function() {
        const E = $dataSystem.equipTypes;
        const L = E.length;
        let root = 1;
        dupeTypes.clear();
        // blank equip type names count as preceding non-blank equip type ID
        for (let n = 1; ++n < L;)
            if (!E[n]) {
                if (dupeTypes.has(root))
                    dupeTypes.get(root).push(n);
                else
                    dupeTypes.set(root, [n]);
            } else
                root = n;
    };

    /**
     * Maps duplicate slots to their root equip type ID.
     * @param {number} etypeId input equip type ID
     * @param {number} n source index
     * @param {number[]} arr source array
     * @returns {number} output equip type ID
     */
    const dupeSlot = function(etypeId) {
        for (const [k, v] of dupeTypes.entries())
            if (v.contains(etypeId))
                return k;
        return etypeId;
    };

    // Initialise dupe types.
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