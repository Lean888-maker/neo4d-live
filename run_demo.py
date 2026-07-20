import pandas as pd
import numpy as np

# 1. Generate 5 years of mock 4D historical draws
np.random.seed(42) # For reproducibility in this demo
dates = pd.date_range(start='2020-01-01', end='2024-12-31', freq='W-WED')
draws = np.random.randint(0, 10000, size=len(dates))

# Create a DataFrame
df = pd.DataFrame({
    'date': dates,
    'lucky_number': [f"{num:04d}" for num in draws] 
})

print(f"✅ Generated {len(df)} historical draws!\n")
print("📊 Here is a sample of the raw data we just 'downloaded':")
print(df.head(), "\n")

# 2. Let's find the 'Hottest' (most frequent) numbers!
hottest_numbers = df['lucky_number'].value_counts().head(10)
print("🔥 THE HOTTEST NUMBERS TO RECOMMEND RIGHT NOW ARE:")
print(hottest_numbers)
print("\n(Note: In a real app, this data would come instantly from BigQuery!)")
