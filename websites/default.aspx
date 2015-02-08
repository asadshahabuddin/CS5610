<%@ Page Language="VB" %>

<script runat="server">
    Sub Page_Load(Sender As Object, E As EventArgs)
	    Welcome.Text = "If you can see this message, your website is up and running!  Visit www.development.ccs.neu.edu for more information about getting started."
    End Sub
</script>

<html>
<head>
<title>Welcome to the CCIS Development Environment!</title>

</head>
<body bgcolor="#FFFFFF">

<p><asp:label id="Welcome" runat="server" /></p>

</body>
</html>