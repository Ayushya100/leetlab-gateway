'use strict';

import { logger } from 'common-node-lib';
import axios from 'axios';
import FormData from 'form-data';

const log = logger('util: request-external-svc');

let externalSvcConfig = {};
let response = {};

const initializeSvc = (protocol, port) => {
  log.info('External service configuration started');
  const host = process.env.NODE_ENV === 'dev' ? `${protocol}://${process.env.HOST}:${port}` : ``;

  externalSvcConfig.host = host;
  log.info('External service configuration completed');
};

const request = async (options) => {
  await axios(options)
    .then((res) => {
      response = {
        status: res.data.statusCode,
        message: res.data.message,
        data: res.data.data,
      };
    })
    .catch((err) => {
      response = {
        status: err.response.data.statusCode,
        message: err.response.data.message,
        data: err.response.data.data,
        errors: err.response.data.errors,
        stack: err.response.data.stack,
      };
    });
};

const sendRequest = async (path, method, payload = null, accessToken = null, setupOptions = {}) => {
  try {
    log.info('Execution of external service request initiated');
    const baseUrl = `${externalSvcConfig.host}${path}`;
    let options = {
      method: method,
      url: baseUrl,
      baseURL: baseUrl,
      timeout: 50000,
      headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json' },
      responseType: 'json',
    };

    if (payload) {
      options.data = payload;
    }

    if (accessToken) {
      options.headers = { ...options.headers, Authorization: `Bearer ${accessToken}` };
    }

    if (setupOptions.retryEnable === true) {
      let retry = 0;
      let retries = setupOptions.retries;
      let error = null;

      while (retry < retries) {
        try {
          await request(options);
          break;
        } catch (err) {
          if (retry < retries) {
            log.error(`External Service request failed! Retrying...`);
          } else {
            log.error(`External Service call failed!`);
          }
          error = err;
          retry++;
        }
      }
    } else {
      await request(options);
    }

    log.success('Execution for making request to the external service completed successfully');
    return response;
  } catch (err) {
    log.error('Some error occurred while making a request to the external service');
    throw {
      status: 500,
      message: 'Error occurred while connecting to the service',
      errors: err,
    };
  }
};

const testConnection = async (protocol, port) => {
  initializeSvc(protocol, port);
  return await sendRequest('/gateway-svc/api/v1.0/health', 'GET', null, null, {
    retryEnable: true,
    retries: 3,
  });
};

export { testConnection };
