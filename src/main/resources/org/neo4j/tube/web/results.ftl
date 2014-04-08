<#-- @ftlvariable name="" type="org.neo4j.tube.web.ResultsView" -->
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
        <label class="col-sm-1 control-label">From</label>

        <div class="col-sm-4">
          <label class="col-sm-1 control-label">${results.fromStation?html}</label>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-1 control-label">To</label>

        <div class="col-sm-4">
          <label class="col-sm-1 control-label">${results.toStation?html}</label>
        </div>
      </div>

      <div>
        <ul>
        <#list results.instructions as instruction>
         <li> ${instruction}</li>
        </#list>
        </ul>
      </div>
    </form>

  </div>
  </body>
  </html>
