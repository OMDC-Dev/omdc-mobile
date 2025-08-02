const path = '../../assets/images/';
const anim_path = '../../assets/animation/';

const ASSETS = {
  logo: require(path + 'logo.png'),
  loginLogo: require(path + 'loginLogo.png'),
  logoDark: require(path + 'authLogo.png'),
  animation: {
    done: require(anim_path + 'done.json'),
    done2: require(anim_path + 'done2.json'),
    failed: require(anim_path + 'failed.json'),
    failed2: require(anim_path + 'failed2.json'),
  },
};

export default ASSETS;
