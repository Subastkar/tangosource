module.exports = {
  map: {
    width: 52,
    height: 27,
    tile: {
      width: 20,
      height: 20
    }
  },

  level1: {
    grid: require('../grids/room1'),
    position1: {x : 740, y: 440},
    //position2: {x : 920, y: 420},
    //position3: {x : 900, y: 140}
  },

  level2: {
    grid: require('../grids/room2'),
    position1: {x : 720, y: 440},
    position2: {x : 720, y: 100},
    position3: {x : 710, y: 280}
  },

  level3: {
    grid: require('../grids/room3'),
    position1: {x : 950, y: 111},
    position2: {x : 950, y: 40},
    position3: {x : 950, y: 350}
  },

  level4: {
    grid: require('../grids/room4'),
    position1: {x : 800, y: 20},
    position2: {x : 960, y: 300},
    position2: {x : 900, y: 400}
  },

  level5: {
    grid: require('../grids/room5'),
    position1: {x : 940, y: 40}
  }
};
