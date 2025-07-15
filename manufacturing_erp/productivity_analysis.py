import pandas as pd
import matplotlib.pyplot as plt
from db_connection import get_db_engine

engine = get_db_engine()

def analyze_productivity():
    query = """
    SELECT e.name, AVG(a.productivity_score) as avg_score, 
           COUNT(a.attendance_id) AS days_worked
    FROM employees e
    JOIN attendance a ON e.emp_id = a.emp_id
    GROUP BY e.name
    ORDER BY avg_score DESC;
    """
    
    df = pd.read_sql(query, engine)
    
    # Plotting with improved formatting
    plt.figure(figsize=(12, 6))  # Wider figure for better name display
    
    bars = plt.bar(df['name'], df['avg_score'], color='skyblue')
    
    plt.xlabel('Employee Name', fontsize=12)
    plt.ylabel('Average Productivity Score (1-10)', fontsize=12)
    plt.title('Employee Productivity Analysis', fontsize=14, pad=20)
    
    # Rotate x-axis labels and adjust alignment
    plt.xticks(
        rotation=45, 
        ha='right',  # Horizontal alignment
        fontsize=10  # Slightly smaller font
    )
    
    # Add value labels on top of each bar
    for bar in bars:
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width()/2., 
            height,
            f'{height:.1f}',
            ha='center',
            va='bottom',
            fontsize=9
        )
    
    # Adjust layout to prevent cutoff
    plt.tight_layout()
    
    # Save and show
    plt.savefig('productivity_report.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    return df

if __name__ == "__main__":
    results = analyze_productivity()
    print(results)