const kWheelRadius = 150;
const kConfirmRadius = 80;
const kDotSize = 60;

export default {
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  dot: {
    position: 'absolute',
    width: kDotSize,
    height: kDotSize,
    borderRadius: kDotSize / 2,
    backgroundColor: 'green',
    opacity: 0,
    active: {
      opacity: 1
    },
  },
  confirmCircle: {
    width: kConfirmRadius * 2,
    height: kConfirmRadius * 2,
    borderRadius: kConfirmRadius,
    backgroundColor: 'white',
    isInConfirmCircle: {
      backgroundColor: 'green',
    },
  },

  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: kWheelRadius * 2,
    width: kWheelRadius * 2,
    marginBottom: 50,
    borderRadius: kWheelRadius,
    backgroundColor: 'red'
  }
}