# MBT - Minecraft Bev Tools

**MBT** contains addons/behavior packs as tools for Minecraft.

### MultiCommand
MultiCommand allows you to execute multiple commands in one, execute commands whenever an area gets attacked
and more coming soon. 
*Triggers*
- **Command Trigger**: Used to run a command 1 tick after the entity is spawned. Usage Example: `/summon c:trigger "say Hello World!; say Command #2; REPEAT:05 say This command will repeat 5 times"`
- **Attack Trigger**: Executes a command whenever a player attacks / clicks on the invisible entity that has a collision box of 1 by 1 by 1 blocks. Usage Example: `/summon c:attack_trigger "say You punched the trigger!" ~ ~ ~`
Currently, it will only run the command as the console and not the attacker

You can also spawn the triggers using a spawn egg, just rename a spawn egg all the commands you want.