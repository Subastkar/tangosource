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
    position1: {x : 740, y: 460},
    position2: {x : 920, y: 420},
    position3: {x : 900, y: 140}
  },

  level2: {
    grid: require('../grids/room2'),
    position1: {x : 720, y: 40},
    position2: {x : 950, y: 40},
    position3: {x : 950, y: 380}
  },

  level3: {
    grid: require('../grids/room3'),
    position1: {x : 950, y: 460}
  },

  level4: {
    grid: require('../grids/room4'),
    position1: {x : 930, y: 40}
  },

  level5: {
    grid: require('../grids/room5'),
    position1: {x : 940, y: 40}
  }
};
