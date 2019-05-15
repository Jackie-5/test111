/**
 * Created by JackieWu on 2019/4/10.
 */
const router = ['index', 'platform', 'login', 'system'];
const routers = [];

router.forEach((item) => {
  routers.push(require(`./routers/${item}.js`).default);
});


export default routers;

