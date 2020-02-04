import { of, Subject, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { ajaxSwitchMap } from './switch-map-operator';

describe('Switch Map Operator', () => {
  let originalSource;

  beforeEach(() => {
    originalSource = new Subject();
  });

  it('should switch from the original stream to the output of the second stream', done => {
    setupAjaxResult(of({id: 45}));

    ajaxSwitchMap(originalSource.asObservable()).subscribe(result => {
      expect(ajax.getJSON).toHaveBeenCalledWith('https://something.com/45');
      expect(result).toEqual({ id: 45 });
      done();
    });

    originalSource.next(45);
  });

  it('should switch from the original stream to an error from the stream', done => {
    setupAjaxResult(throwError('this is bad'));

    ajaxSwitchMap(originalSource.asObservable()).subscribe(result => {
      expect(result).toEqual('this is bad');
      done();
    });
    originalSource.next(65);
  });

  function setupAjaxResult(result$) {
    spyOn(ajax, 'getJSON').and.returnValue(result$);
  }
});
