/*
*
* MultiCommand v1.0.0
* Made by Imrglop.
* MBT: github.com/Imrglop/minecraft-bev-tools
*
*/

const debug = false; // debug mode

var currentTick = 0;

const delayInTicks = 0; // delay command exec, plus around 1 tick

const commandSeperatorKey = ";";

const system = server.registerSystem(0, 0);

system.initialize = function() {
	var scriptLoggerConfig = this.createEventData("minecraft:script_logger_config");
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);
    
    /* Your other setup operations afterwards */
}

function execute(ln) {
	function test(results) {}
	system.executeCommand(ln, (results) => {test(results)});
}

var Entities = [];

system.listenForEvent("minecraft:player_attacked_entity", function(eventData) {
	if (eventData.data.attacked_entity.__identifier__ == "c:attack_trigger" && system.hasComponent(eventData.data.attacked_entity, "minecraft:nameable")) {
		eventData.data.attacked_entity.Timing = currentTick + delayInTicks;
		Entities[Entities.length] = eventData.data.attacked_entity; // add to arraylist
	}
});

system.listenForEvent("minecraft:entity_created", function(eventData) {
	if (eventData.data.entity) {
		if (eventData.data.entity.__identifier__ == "c:trigger" && system.hasComponent(eventData.data.entity, "minecraft:nameable")) {
			eventData.data.entity.Timing = currentTick + delayInTicks;
			Entities[Entities.length] = eventData.data.entity; // add to arraylist
		}
	}
})

system.update = function() {
	
	if (debug) execute("title @a actionbar Addon Still Loaded");

	// Command Executor
	
		if (Entities.length != 0) {  // testfor any entities in the arraylist
			for (let i = 1; i < Entities.length; i++) { // for every added entity
				let entity = Entities[i];
				if (entity != null) {
					if (entity.Timing <= currentTick) { // if they are now going to be processed
						//if (true)  {
							if (!(system.isValidEntity(entity))) {
								delete entity;
								delete Entities[i];
								return;
							}

							const name = system.getComponent(entity, "minecraft:nameable").data.name;
							let split = name.split(commandSeperatorKey);
							for (let _i = 0; _i < split.length; _i++) {
								let item = split[_i];
								if (item.split("REPEAT:")[1] != undefined && item.split("REPEAT:")[1] != "") { // repeat function like: summon c:trigger "REPEAT:10 say this will repeat 10 times;REPEAT:03 say 123"
									let restOfCmd = new String(item.split("REPEAT:")[1]);
									let numToRepeat = Number(restOfCmd.substr(0, 2)); // get first 2 characters in the string and turn it into a number
									if (isNaN(numToRepeat)) return;
									if (debug) execute(`say ${numToRepeat.toString()}`);
									let key = 0;
									for (; key < numToRepeat; key++) { // execute the command this many times
										execute(restOfCmd.substr(2));
									}
									delete Entities[i];
									system.destroyEntity(entity); // tried to avoid this but needed to stop it from spamming the command
									return;
								} else {
									execute(split[_i]);
								}
							}
							if (entity)
							if (entity.__identifier__ != "c:attack_trigger") {
								system.destroyEntity(entity); // destroy the entity
								delete Entities[i]
							} else {
								delete Entities[i];
								delete entity;
							}
						//}
					}
				}
			}
	}
	
	
	currentTick++;
}


