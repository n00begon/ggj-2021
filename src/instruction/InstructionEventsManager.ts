/**
 * InstructionEventsManager is the Instruction's instance of an EventEmitter to ensure there are no collisions
 * with other even emitters
 */
export const InstructionEventsManager = new Phaser.Events.EventEmitter();
