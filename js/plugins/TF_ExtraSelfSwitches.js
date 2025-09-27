/*:
 * @target MZ
 * @plugindesc Added self switches from E to Z
 * @help Due to the editor UI being hard coded, 
 * this plugin utilize direct script instead.
 * 
 * To set the switch use:
 * $gameSelfSwitches.setValue([map_ID, event_ID, 'F'], true)
 *
 * 
 * To check the switch use:
 * $gameSelfSwitches.value([map_ID, event_ID, 'F'])
 * 
 * Message to lowel or anyone trying to use this feature: 
 * Use the in build self switch (A,B,C,D) to run the first event page once. 
 * Make it so that the first page is only for setting the custom self switch. 
 * The if check for the custom self switch should be contained in the new event page.
 * 
 * Free to use and/or modify for any project, no credit required.
 */
// M06) 
// void (() => {

(function() {
'use strict';

    const str = "EFGHIJKLMNOPQRSTUVWSYZ";
    const alphaArray = str.split("");

    // Store the original method for checking self-switches
    const _Game_Event_isSelfSwitchActive = Game_Event.prototype.isSelfSwitchActive;

    // Override the method to include our new switches
    Game_Event.prototype.isSelfSwitchActive = function(switchId) {
        // First, check if it's one of the original switches (A-D)
        if (['A','B','C','D'].includes(switchId)) {
            // If it is, use the original game's logic
            return _Game_Event_isSelfSwitchActive.call(this, switchId);
        }
        // If it's one of our new switches, check our custom data
        else if (alphaArray.includes(switchId)) {
            // Create a unique key for this event's self-switch
            const key = [$gameMap.mapId(), this.eventId(), switchId];
            // Return its value (false if it hasn't been set yet)
            return $gameSelfSwitches.value(key) || false;
        }
        // If the switch ID is not recognized, return false
        return false;
    };

    // Store the original method for setting self-switches
    const _Game_Event_setSelfSwitch = Game_Event.prototype.setSelfSwitch;

    // Override the method to also handle setting switches
    Game_Event.prototype.setSelfSwitch = function(switchId, value) {
        // For the original switches A-D, use the original game logic
        if (['A','B','C','D'].includes(switchId)) {
            _Game_Event_setSelfSwitch.call(this, switchId, value);
        }
        // For our new switches, handle the data ourselves
        else if (alphaArray.includes(switchId)) {
            const key = [$gameMap.mapId(), this.eventId(), switchId];
            $gameSelfSwitches.setValue(key, value);
        }
    };

})();