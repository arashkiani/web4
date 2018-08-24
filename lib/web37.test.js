import web37 from './web37.js'

describe('web37', () => {
  console.dir(web37)
  test(`Import`, () => {
    expect(1).toBe(1);
  });
  /*data.map((t) => {
    test(`Expect ${t.num} to be ${t.result ? t.result : 'Empty'}`, () => {
      expect(toRomen(t.num)).toBe(t.result);
    });
  });*/
});