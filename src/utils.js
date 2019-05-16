/**
 * Created by liudonghua on 2017-01-21.
 */

export const getToken = (req) => {
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return '';
};
