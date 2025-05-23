'use strict';

import { buildApiResponse, logger } from 'common-node-lib';
import healthCheck from './healthCheck.route.js';

const log = logger('Router: redirect-api-to-service');

const redirectAPIRoutes = async (req, res, next) => {
  try {
    log.info('Redirect user request to desired service process initiated');
    const payload = req.body;
    const method = req.method;
    const requestUrl = req.url;
    const protocol = req.protocol;

    let response = {};
    if (method === 'GET' && requestUrl === '/gateway-svc/api/v1.0/health') {
      log.info('Call controller function to check the service health');
      response = healthCheck();
    } else {
    }

    res.status(response.status).json(buildApiResponse(response));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default redirectAPIRoutes;
