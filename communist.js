(function() {
  var Communist,
    __slice = [].slice;

  Communist = function(fun) {
    var bUrl, blob, body, _func, _worker,
      _this = this;
    if (typeof fun !== "function") {
      return;
    }
    if (window.Worker) {
      window.URL = window.URL || window.webkiURL;
      body = "var send;var _f =  " + (fun.toString()) + ";self.addEventListener('message', function(_e) {send = function(data){self.postMessage({messege:data,cb:_e.data.cb})};try{self.postMessage({body:_f.apply(null, _e.data.body),cb:_e.data.cb})}catch(_err){self.postMessege({error:_err,cb:_e.data.cb})}})";
      blob = new Blob([body], {
        type: "text/javascript"
      });
      bUrl = window.URL.createObjectURL(blob);
      _worker = new Worker(bUrl);
      this.CBs = {};
      this.send = function() {
        var cb, data, id, _i;
        data = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        id = ("" + Math.random()).slice(2);
        _this.CBs[id] = cb;
        _worker.postMessage({
          body: data,
          cb: id
        });
        _worker.onmessage = function(e) {
          if (e.data.body) {
            _this.CBs[e.data.cb](null, e.data.body);
            delete _this.CBs[e.data.cb];
          } else if (e.data.messege) {
            _this.CBs[e.data.cb](null, e.data.messege);
          } else if (e.data.error) {
            CBs[e.data.cb](e.data.error);
            delete _this.CBs[e.data.cb];
          }
          return true;
        };
        _worker.onerror = function(e) {
          cb(e);
          return true;
        };
        return true;
      };
      this.close = function() {
        _worker.terminate();
        return true;
      };
      return true;
    } else {
      _func = fun;
      this.send = function() {
        var cb, data, _i;
        data = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        try {
          cb(null, _func.apply(null, data));
        } catch (err) {
          cb(err);
        }
        return true;
      };
      this.close = function() {
        _func = void 0;
        return true;
      };
      return true;
    }
  };

  window.communist = function(fun) {
    return new Communist(fun);
  };

}).call(this);
