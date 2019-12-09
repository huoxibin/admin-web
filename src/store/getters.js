let getters = {
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  userId: state => state.user.userId,
  menuInfo: state => state.user.menuInfo,
  userInfo: state => state.user.userInfo,
  breadCrumbs: state => state.user.breadCrumbs,
  publicMenuInfo: state => state.user.publicMenuInfo,
	homeInfo:state => state.user.homeInfo,
	trafficChannel:state => state.user.trafficChannel,
};

export default getters;
