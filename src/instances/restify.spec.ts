import { expect } from 'chai';

import * as pkg from '../../package.json';

import { server } from './restify';

describe('restify', () => {
  it('should be an instance of restify', () => {
    expect(server).to.have.property('name');
    expect(server).to.have.property('log');
    expect(server).to.have.property('router');
    expect(server).to.have.property('server');
    expect(server.name).to.be.equal((pkg as any).name);
  });
});
