export enum ChatChannel{
    NORMAL = "*",
    GROUP = "$",
    TRADE = ":",
    RECRUTE = "?",
    ADMIN = "@",
    GUILD = "%",
    ALIGNMENT = "!",
    PRIVATE = "F"
}

export enum PacketCmd{
    ASK = "ASK",
    ChatMessage = "cMK",
    GameMovement = "GM",
    BasicMessage = "BM",
    MapData = "GDM",
    GameEnd = "GE",
    GameTurnStart = "GTS",
    GamePlacement = "GP",
    GameAction = "GA",

}

export enum CellTypes{
    NOT_WALKABLE = 0,
    INTERACTIVE_OBJECT = 1,
    TELEPORT_CELL = 2,
    UNKNOWN1 = 3,
    WALKABLE = 4,
    UNKNOWN2 = 5,
    PATH_1 = 6,
    PATH_2 = 7
}

export enum EntityType{
    CREATURE = -1,
    MOB = -2,
    MOB_GROUP = -3,
    NPC = -4,
    MERCHANT = -5,
    PERZ = -6,
}

export enum GameAction{
    MOVEMENT = 1,
    CAST_SPELL = 300,
    HAND_ATTACK = 303,
    MAP_ACTION = 500,
    HOUSE_ACTION = 507,
    ACCEPT_MARIAGE = 618,
    DECLINE_MARIAGE = 619,
    REQUEST_DUEL = 900,
    ACCEPT_DUEL = 901,
    DECLINE_DUEL = 902,
    JOIN_FIGHT = 903,
    START_FIGHT = 905,
    AGGO = 906,
    PERC = 909,
}