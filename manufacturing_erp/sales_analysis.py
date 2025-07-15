import pandas as pd
from db_connection import get_db_engine

engine = get_db_engine()

def analyze_sales():
    query = """
    SELECT 
        c.district, 
        p.name AS product, 
        SUM(s.quantity) AS total_sold,
        SUM(s.quantity * p.unit_price) AS revenue
    FROM sales s
    JOIN customers c ON s.customer_id = c.customer_id
    JOIN products p ON s.product_id = p.product_id
    GROUP BY c.district, p.name
    ORDER BY revenue DESC;
    """
    
    df = pd.read_sql(query, engine)
    
    # Generate report
    report = df.pivot_table(
        index='district',
        columns='product',
        values='revenue',
        aggfunc='sum',
        fill_value=0
    )
    
    print("Sales Report by District:")
    print(report)
    
    return df

if __name__ == "__main__":
    analyze_sales()