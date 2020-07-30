var BCLS = (function (window, document) {
  /**
   * To build your own version, replace the following:
   * account_id
   * policy_key
   * video_ids
   * player_id
   */
  var account_id = '1752604059001',
      policy_key =
      'BCpkADawqM3CNfUEBYGvWS8QqHHg-g5kzNt63RmoOyVlrIL4zT67_KKSzlaI5TGMXIZZ4Yrtz28v7EcHTsTWAiOolxok8ZNqFrkNGru9OOumeQ8wX5csvYqx7zl468WgbhqDnpePPhQVpQfr',
      video_ids = [
        '6156696074001',
        '5811864560001',
        '5715315990001',
        '5550679964001',
        '5686632029001',
        '5819230967001',
        '5992439742001',
        '5811857173001',
        '6026822730001'
      ],
      player_id = 'WRgbJgqAe',
      player_container = document.getElementById('player_container'),
      video_grid = document.getElementById('video_grid');
      

  function buildPlayer (video_id) {
    brightcovePlayerLoader({
      refNode: player_container,
      accountId: account_id,
      playerId: player_id,
      videoId: video_id,
      embedId: 'default',
    })
      .then(function (success) {
        player_loaded = true;
        console.log(success.ref);
      })
      .catch(function (error) {
        var p = document.createElement('p');
        p.textContent =
          'Sorry - the player could not be loaded. Please try again later.';
        player_container.appendChild(p);
      });
  }

  function buildGrid (video_data) {
    var i = 0,
        iMax = video_data.length,
        div,
        img,
        p,
        video,
        frag = document.createDocumentFragment();

    for (i; i < iMax; i++) {
      video = video_data[i];
      div = document.createElement('div');
      img = document.createElement('img');
      p = document.createElement('p');
      div.setAttribute('id', video.id);
      div.setAttribute('class', 'grid-item');
      img.setAttribute('src', video.thumbnail);
      img.setAttribute('class', 'thumbnail');
      p.setAttribute('class', 'truncate');
      p.textContent = video.name;
      frag.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
    }
    video_grid.appendChild(frag);
    setListeners();
  }

  function setListeners() {
    var i = 0,
        grid_items = document.getElementsByClassName('grid-item'),
        iMax = grid_items.length;
console.log(iMax);
    for (i; i < iMax; i++) {
      console.log(grid_items[i]);
      grid_items[i].addEventListener('click', function(e) {
        console.log('id', this.id);
        buildPlayer(this.id);
      });
    }
  }

  function createRequest () {
    var request_data = {},
        i = 0,
        iMax = video_ids.length;

    request_data.request =
      'https://edge.api.brightcove.com/playback/v1/accounts/1752604059001/videos?q=';
    for (i; i < iMax; i++) {
      request_data.request = request_data.request + 'id:' + video_ids[i];
      if (i < iMax - 1) {
        request_data.request = request_data.request + '%20';
      }
    }
    console.log('request', request_data.request);
    request_data.policy_key = policy_key
    sendRequest(request_data, function (video_data) {
      if (video_data && video_data.length > 0) {
        video_data = JSON.parse(video_data);
        buildGrid(video_data.videos)
      } else {
        var h4 = document.createElement('h4');
        h4.textContent =
          'Videos are currently unavailable. Please try again later.';
        video_grid.appendChild(h4);
      }
    });
  }

  function sendRequest (request_data, callback) {
    var httpRequest = new XMLHttpRequest(),
        // response handler
        getResponse = function () {
          try {
            if (httpRequest.readyState === 4) {
              if (httpRequest.status >= 200 && httpRequest.status < 300) {
                callback(httpRequest.responseText);
              }
            }
          } catch (e) {
            alert('Caught Exception: ' + e);
          }
        };

    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('GET', request_data.request);
    // set headers
    httpRequest.setRequestHeader('BCOV-Policy', request_data.policy_key);
    // open and send request
    httpRequest.send();
  }

  createRequest();
})(window, document)
