import CETEI from 'CETEIcean'

export function addCETEIceanBehaviors() {
  const cetei = new CETEI();

// Split Notes
  cetei.addBehaviors({
    tei: {
      note: function (el) {}
    }
  });

  return cetei;
}