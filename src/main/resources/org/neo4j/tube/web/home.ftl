<#-- @ftlvariable name="" type="org.neo4j.tube.web.SayingView" -->
  <html>
  <head>
    <title>The Tube Graph</title>
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="/assets/css/bootstrap-theme.min.css">

    <!-- Latest compiled and minified JavaScript -->
    <script src="/assets/js/bootstrap.min.js"></script>
  <head>
  <body>
  <div class="container">
    <h1>The Tube Graph</h1>

    <form class="form-horizontal" role="form" action="/tube" method="GET" >
      <div class="form-group">
        <label for="from" class="col-sm-1 control-label">From</label>

        <div class="col-sm-4">
          <input type="text" class="form-control" id="from" placeholder="From" name="from">
        </div>
      </div>
      <div class="form-group">
        <label for="to" class="col-sm-1 control-label">To</label>

        <div class="col-sm-4">
          <input type="text" class="form-control" id="to" placeholder="To" name="to">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-1 col-sm-4">
          <button type="submit" class="btn btn-default">Plan my journey</button>
        </div>
      </div>
    </form>

  </div>
  </body>
  </html>
