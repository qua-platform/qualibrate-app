from dash import Dash, Input, Output, callback, dcc, html

app = Dash(
    requests_pathname_prefix="/dashboard/",
)

VALUES = ["First", "Second", "Third"]

app.layout = [
    html.H1(children="Title of Dash App", style={"textAlign": "center"}),
    dcc.Dropdown(VALUES, VALUES[0], id="dropdown-selection"),
    html.Br(),
    html.Div(id="selected-value"),
]


@callback(
    Output("selected-value", "children"),
    Input("dropdown-selection", "value"),
)
def update_output_div(value: str) -> str:
    return f"Selected value: {value}"


if __name__ == "__main__":
    app.run(debug=True)
