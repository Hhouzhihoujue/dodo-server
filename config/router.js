const { loadDir } = require('../utils/common');

const loadRouter = router => {
	const routerFiles = loadDir('./modules/**/*.router.js');
	routerFiles.forEach(path => require(path)(router));
};

module.exports = loadRouter;